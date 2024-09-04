import { create } from 'zustand';
import { temporal } from 'zundo';
import { BlockState } from '../components/panels/blocks';

interface EditorState {
  history: BlockState[];
  createHistory: (newHistory: BlockState[]) => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      history: [],
      createHistory: (newHistory) => set({ history: newHistory }),
    }),
    { limit: 10 }
  )
);
