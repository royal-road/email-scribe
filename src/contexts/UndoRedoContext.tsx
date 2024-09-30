import React, { createContext, useContext, useMemo } from 'react';
import { createEditorStore } from '../hooks/undoRedoStore';

interface UndoRedoContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  useEditorStore: ReturnType<typeof createEditorStore>;
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(
  undefined
);

export const UndoRedoProvider: React.FC<{
  children: React.ReactNode;
  scribeId: string;
}> = ({ children, scribeId }) => {
  const useEditorStore = useMemo(() => createEditorStore(scribeId), [scribeId]);
  const { undo, redo, pastStates, futureStates } =
    useEditorStore.temporal.getState();

  const value = useMemo(
    () => ({
      undo,
      redo,
      canUndo: pastStates.length > 2,
      canRedo: futureStates.length !== 0,
      useEditorStore,
    }),
    [undo, redo, pastStates.length, futureStates.length, useEditorStore]
  );

  return (
    <UndoRedoContext.Provider value={value}>
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
