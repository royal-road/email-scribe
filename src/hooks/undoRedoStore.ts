import { create, StateCreator } from 'zustand';
import { temporal } from 'zundo';
import { BlockState } from '@/panels/blocks';

interface EditorState {
  id: string;
  history: BlockState[];
  createHistory: (newHistory: BlockState[]) => void;
}

const createEditorStore = (id: string) => {
  const storeCreator: StateCreator<EditorState> = (set) => ({
    id,
    history: [],
    createHistory: (newHistory) => set({ history: newHistory }),
  });

  return create<EditorState>()(temporal(storeCreator, { limit: 30 }));
};

export { createEditorStore };
