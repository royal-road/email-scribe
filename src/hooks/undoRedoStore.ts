import { create } from 'zustand';
import { temporal } from 'zundo';
import { BlockState, BlockAttributes } from '../components/panels/blocks';

interface HistoryEntry {
  blocks: BlockState[];
  attributes: BlockAttributes;
}

interface EditorState {
  history: HistoryEntry;
  createHistory: (newHistory: HistoryEntry) => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      history: { blocks: [], attributes: {} },
      createHistory: (newHistory) => set({ history: newHistory }),
    }),
    { limit: 10 }
  )
);
