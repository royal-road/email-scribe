import React, { createContext, useContext } from 'react';
import { useEditorStore } from '../hooks/undoRedoStore';

interface UndoRedoContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(
  undefined
);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { undo, redo, pastStates, futureStates } =
    useEditorStore.temporal.getState();
  // console.log('pastStates', pastStates.length, futureStates.length);
  return (
    <UndoRedoContext.Provider
      value={{
        undo,
        redo,
        canUndo: pastStates.length > 2,
        canRedo: futureStates.length !== 0,
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
