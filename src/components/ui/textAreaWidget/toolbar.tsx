import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold, Italic, UnderlineIcon } from 'lucide-react';
import { useState } from 'react';
import { ToggleButton } from '../toggle';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';

// src/components/editor/plugins/toolbar-plugin.tsx
export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const anchorNode = selection.anchor.getNode();

      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [editor, $updateToolbar]);

  return (
    <div className='w-full p-1 border-b z-10'>
      <div className='flex space-x-2 justify-center'>
        <ToggleButton
          area-label='Bold'
          size='sm'
          isActive={isBold}
          onToggle={(pressed: boolean | ((prevState: boolean) => boolean)) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            setIsBold(pressed);
          }}
        >
          <Bold />
        </ToggleButton>

        <ToggleButton
          area-label='Italic'
          size='sm'
          isActive={isItalic}
          onToggle={(pressed: boolean | ((prevState: boolean) => boolean)) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            setIsItalic(pressed);
          }}
        >
          <Italic />
        </ToggleButton>

        <ToggleButton
          area-label='Underline'
          size='sm'
          isActive={isUnderline}
          onToggle={(pressed: boolean | ((prevState: boolean) => boolean)) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            setIsUnderline(pressed);
          }}
        >
          <UnderlineIcon />
        </ToggleButton>
      </div>
    </div>
  );
}
