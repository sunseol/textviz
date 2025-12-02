import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PromptBlock } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface JsonBuilderStore {
  library: PromptBlock[];
  canvasBlocks: PromptBlock[];
  selectedBlockId: string | null;
  
  addBlockToCanvas: (block: PromptBlock) => void;
  removeBlockFromCanvas: (blockId: string) => void;
  reorderCanvasBlocks: (activeId: string, overId: string) => void;
  updateBlockParameter: (blockId: string, key: string, value: any) => void;
  selectBlock: (blockId: string | null) => void;
  
  // Library actions
  addBlockToLibrary: (block: PromptBlock) => void;
}

// Initial sample blocks
const initialLibrary: PromptBlock[] = [
  {
    id: 'style-cyberpunk',
    name: 'Cyberpunk Style',
    description: 'Futuristic, neon lights, high tech',
    category: 'style',
    parameters: {},
    template: 'in cyberpunk style, neon lights, futuristic city background',
  },
  {
    id: 'camera-wide',
    name: 'Wide Angle',
    description: 'Wide angle lens shot',
    category: 'camera',
    parameters: { mm: 16 },
    template: 'wide angle lens, {{mm}}mm',
  },
  {
    id: 'subject-cat',
    name: 'Cat',
    description: 'A cute cat',
    category: 'subject',
    parameters: { color: 'white' },
    template: 'a cute {{color}} cat',
  },
  {
    id: 'lighting-cinematic',
    name: 'Cinematic Lighting',
    description: 'Dramatic lighting',
    category: 'lighting',
    parameters: {},
    template: 'cinematic lighting, dramatic shadows',
  },
];

export const useJsonBuilderStore = create<JsonBuilderStore>()(
  persist(
    (set) => ({
      library: initialLibrary,
      canvasBlocks: [],
      selectedBlockId: null,

      addBlockToCanvas: (block) =>
        set((state) => ({
          canvasBlocks: [
            ...state.canvasBlocks,
            { ...block, id: uuidv4() }, // Create a new instance with unique ID
          ],
        })),

      removeBlockFromCanvas: (blockId) =>
        set((state) => ({
          canvasBlocks: state.canvasBlocks.filter((b) => b.id !== blockId),
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        })),

      reorderCanvasBlocks: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.canvasBlocks.findIndex((b) => b.id === activeId);
          const newIndex = state.canvasBlocks.findIndex((b) => b.id === overId);
          
          if (oldIndex === -1 || newIndex === -1) return state;

          const newBlocks = [...state.canvasBlocks];
          const [movedBlock] = newBlocks.splice(oldIndex, 1);
          newBlocks.splice(newIndex, 0, movedBlock);

          return { canvasBlocks: newBlocks };
        }),

      updateBlockParameter: (blockId, key, value) =>
        set((state) => ({
          canvasBlocks: state.canvasBlocks.map((b) =>
            b.id === blockId
              ? { ...b, parameters: { ...b.parameters, [key]: value } }
              : b
          ),
        })),

      selectBlock: (blockId) => set({ selectedBlockId: blockId }),

      addBlockToLibrary: (block) =>
        set((state) => ({
          library: [...state.library, block],
        })),
    }),
    {
      name: 'textviz-json-builder-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
