import { useEffect } from 'react';
import { useUndoRedo } from '../UndoRedoContext';

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'z' &&
        !event.shiftKey
      ) {
        event.preventDefault();
        if (canUndo) undo();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === 'Z'
      ) {
        event.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);
};
