import React, { createContext, useState, useContext, useCallback } from 'react';
import { BlockAttributes, BlockState } from './components/panels/blocks';

export interface HistoryEntry {
  blocks: BlockState[];
  attributes: BlockAttributes;
}

interface UndoRedoContextType {
  undoRedoIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  addToHistory: (entry: HistoryEntry) => void;
  undo: () => void;
  redo: () => void;
  getCurrentHistoryEntry: () => HistoryEntry | undefined;
  hasUndoRedoOccurred: boolean;
  setHasUndoRedoOccurred: React.Dispatch<React.SetStateAction<boolean>>;
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(
  undefined
);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [undoRedoIndex, setUndoRedoIndex] = useState(-1);
  const [hasUndoRedoOccurred, setHasUndoRedoOccurred] = useState(false);

  const canUndo = undoRedoIndex > 0;
  const canRedo = undoRedoIndex < history.length - 1;

  const addToHistory = useCallback(
    (entry: HistoryEntry) => {
      console.log('HI!', entry);
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory.slice(0, undoRedoIndex + 1), entry];
        setUndoRedoIndex(newHistory.length - 1);
        setHasUndoRedoOccurred(false);
        return newHistory;
      });
    },
    [undoRedoIndex]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      setUndoRedoIndex((prevIndex) => prevIndex - 1);
      setHasUndoRedoOccurred(true);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setUndoRedoIndex((prevIndex) => prevIndex + 1);
      setHasUndoRedoOccurred(true);
    }
  }, [canRedo]);

  const getCurrentHistoryEntry = useCallback(() => {
    return history[undoRedoIndex];
  }, [history, undoRedoIndex]);

  return (
    <UndoRedoContext.Provider
      value={{
        undoRedoIndex,
        canUndo,
        canRedo,
        addToHistory,
        undo,
        redo,
        getCurrentHistoryEntry,
        hasUndoRedoOccurred,
        setHasUndoRedoOccurred,
      }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (context === undefined) {
    throw new Error('useUndoRedo must be used within a UndoRedoProvider');
  }
  return context;
};
