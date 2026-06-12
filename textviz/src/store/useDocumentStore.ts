import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseConfig } from '@/lib/supabase/env';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultTitle, defaultTemplates } from './document/templates';
import { clearLocalDocs, getLocalActiveId, getLocalDocs, saveLocalActiveId, saveLocalDocs } from './document/localDocuments';
import type { Document, DocumentDbUpdate, DocumentType, DocumentUpdate, RemoteDocumentRow } from './document/types';

export type { Document, DocumentType } from './document/types';

interface DocumentStore {
  documents: Document[];
  activeDocumentId: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  fetchDocuments: () => Promise<void>;
  setIsInitialized: (isInitialized: boolean) => void;
  addDocument: (type: DocumentType) => Promise<Document | void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: DocumentUpdate) => Promise<void>;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | null;
  getDocumentsByType: (type: DocumentType) => Document[];
  syncLocalDocuments: () => Promise<number>; // Returns count of synced docs
}

const getOptionalSupabaseClient = () => getSupabaseConfig() ? createClient() : null;

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  isLoading: false,
  isInitialized: false,

  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),

  fetchDocuments: async () => {
    set({ isLoading: true });
    const supabase = getOptionalSupabaseClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (supabase && user) {
      // Remote Mode
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })
        .returns<RemoteDocumentRow[]>();

      if (error) {
        console.error('Error fetching documents:', error);
        set({ isLoading: false, isInitialized: true });
        return;
      }

      const documents: Document[] = data.map(doc => ({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        createdAt: new Date(doc.created_at).getTime(),
        updatedAt: new Date(doc.updated_at).getTime(),
        user_id: doc.user_id,
        isLocal: false,
        metadata: doc.metadata ?? undefined,
      }));

      set({ documents, isLoading: false, isInitialized: true });
    } else {
      // Local Mode
      const localDocs = getLocalDocs();
      set({ documents: localDocs, isLoading: false, isInitialized: true });
    }

    // Set active document if needed
    if (!get().activeDocumentId) {
      const savedActiveId = getLocalActiveId();
      if (savedActiveId && get().documents.some(d => d.id === savedActiveId)) {
        set({ activeDocumentId: savedActiveId });
      }
    }
  },

  addDocument: async (type: DocumentType) => {
    const supabase = getOptionalSupabaseClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    const documents = get().documents;
    const typeDocuments = documents.filter(doc => doc.type === type);
    const title = getDefaultTitle(type, typeDocuments);
    const content = defaultTemplates[type];

    if (supabase && user) {
      // Add to Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type,
          title,
          content,
          metadata: {},
        })
        .select()
        .single<RemoteDocumentRow>();

      if (error) {
        console.error('[useDocumentStore] Error creating remote document:', error);
        return;
      }

      const newDoc: Document = {
        id: data.id,
        type: data.type,
        title: data.title,
        content: data.content,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
        user_id: data.user_id,
        isLocal: false,
        metadata: data.metadata ?? undefined,
      };

      set({
        documents: [newDoc, ...documents],
        activeDocumentId: newDoc.id,
      });
      return newDoc;
    } else {
      // Add to Local
      const newDoc: Document = {
        id: uuidv4(),
        type,
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isLocal: true,
      };

      try {
        // Ensure we have the latest local docs to avoid overwriting with stale state
        const currentLocalDocs = getLocalDocs();
        // Check if we already have this doc (unlikely but safe)
        const exists = currentLocalDocs.some(d => d.id === newDoc.id);
        const newDocuments = exists ? currentLocalDocs : [newDoc, ...currentLocalDocs];

        saveLocalDocs(newDocuments);

        set({
          documents: newDocuments,
          activeDocumentId: newDoc.id,
          isInitialized: true
        });
        return newDoc;
      } catch (error) {
        console.error('[useDocumentStore] Error creating local document:', error);
        throw error; // Re-throw so UI can handle if needed
      }
    }
  },

  deleteDocument: async (id: string) => {
    const supabase = getOptionalSupabaseClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (supabase && user) {
      // If it happens to be a lingering local doc (shouldn't happen in strict mode but possible),
      // we should check. But assuming we only show remote docs when logged in (except during sync),
      // we can try deleting from remote.
      const docToDelete = get().documents.find(d => d.id === id);
      if (!docToDelete?.isLocal) {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting document:', error);
          return;
        }
      }
    }

    // Local delete (or UI update for remote)
    const documents = get().documents.filter(doc => doc.id !== id);
    if (!user) {
      saveLocalDocs(documents); // Persist local delete
    }

    const activeDocumentId = get().activeDocumentId;

    set({
      documents,
      activeDocumentId: activeDocumentId === id ? (documents[0]?.id || null) : activeDocumentId,
    });
  },

  updateDocument: async (id: string, updates: DocumentUpdate) => {
    // 1. Optimistic Update
    const currentDocuments = get().documents;
    const docIndex = currentDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return;

    const oldDoc = currentDocuments[docIndex];
    const newDoc = {
      ...oldDoc,
      ...updates,
      updatedAt: Date.now(),
    };

    const newDocuments = [...currentDocuments];
    newDocuments[docIndex] = newDoc;

    set({ documents: newDocuments });

    // 2. Persist
    const supabase = getOptionalSupabaseClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (supabase && user && !newDoc.isLocal) {
      const dbUpdates: DocumentDbUpdate = {
        updated_at: new Date().toISOString(),
        ...(updates.content !== undefined ? { content: updates.content } : {}),
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.metadata !== undefined ? { metadata: updates.metadata } : {}),
      };

      const { error } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating document:', error);
        // Might want to revert optimistic update here in a real app
      }
    } else {
      // Local Storage Update
      saveLocalDocs(newDocuments);
    }
  },

  syncLocalDocuments: async () => {
    const localDocs = getLocalDocs();
    if (localDocs.length === 0) return 0;

    const supabase = getOptionalSupabaseClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    if (!supabase || !user) return 0;

    let syncedCount = 0;

    for (const doc of localDocs) {
      const { error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: doc.type,
          title: doc.title, // Keep title, duplicates allowed
          content: doc.content,
        });

      if (!error) {
        syncedCount++;
      } else {
        console.error('Failed to sync doc:', doc.title, error);
      }
    }

    if (syncedCount > 0) {
      if (syncedCount === localDocs.length) {
        clearLocalDocs();
      }

      await get().fetchDocuments(); // Refresh from server
    }

    return syncedCount;
  },

  setActiveDocument: (id: string) => {
    set({ activeDocumentId: id });
    saveLocalActiveId(id);
  },

  getActiveDocument: () => {
    const { documents, activeDocumentId } = get();
    return documents.find(doc => doc.id === activeDocumentId) || null;
  },

  getDocumentsByType: (type: DocumentType) => {
    return get().documents.filter(doc => doc.type === type);
  },
}));
