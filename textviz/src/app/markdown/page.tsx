"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { DocumentSidebar } from '@/components/layout/DocumentSidebar';
import { EditorHeader } from '@/components/layout/EditorHeader';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

const MilkdownEditor = dynamic(
  () => import('@/components/markdown/MilkdownEditor').then((mod) => mod.MilkdownEditor),
  { ssr: false }
);

export default function MarkdownPage() {
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const documents = useDocumentStore((state) => state.documents);
  const activeDocumentId = useDocumentStore((state) => state.activeDocumentId);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);
  const isInitialized = useDocumentStore((state) => state.isInitialized);
  const { t } = useLanguageStore();

  const activeDocument = React.useMemo(() =>
    documents.find(doc => doc.id === activeDocumentId) || null,
    [documents, activeDocumentId]
  );

  const isLoading = useDocumentStore((state) => state.isLoading);

  React.useEffect(() => {
    setMounted(true);
    fetchDocuments();
  }, [fetchDocuments]);

  React.useEffect(() => {
    // Create initial document if none exists
    if (isInitialized && !isLoading && documents.filter(d => d.type === 'markdown').length === 0) {
      addDocument('markdown');
    }
  }, [isInitialized, isLoading, documents, addDocument]);

  const markdown = activeDocument?.type === 'markdown' ? activeDocument.content : '';

  const handleEditorChange = (value: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: value });
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Header />
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Sidebar */}
        <div className="hidden shrink-0 lg:block">
          <DocumentSidebar active="markdown" />
        </div>

        {/* Main Editor Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          {/* Editor Header */}
          <EditorHeader
            title={activeDocument?.title || `${t.editor.untitled}.md`}
            typeLabel={t.nav.markdown}
            onTitleChange={(newTitle) => {
              if (activeDocument) {
                updateDocument(activeDocument.id, { title: newTitle });
              }
            }}
            onMobileMenuClick={() => setMobileMenuOpen(true)}
          />

          {/* Milkdown Editor */}
          <div className="flex-1 overflow-hidden">
            {activeDocument ? (
              <MilkdownEditor
                key={activeDocument.id} // Re-mount on doc change to reset editor state
                content={markdown}
                onChange={handleEditorChange}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                Select or create a document
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        active="markdown"
      />
    </div >
  );
}
