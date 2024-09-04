import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold, Italic, Strikethrough, UnderlineIcon } from 'lucide-react';
import { useState } from 'react';
import { Toggle } from '../toggle';
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

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

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
    <div className='editor-toolbar'>
      <div
        style={{
          display: 'flex',
          gap: '0.2rem',
        }}
      >
        <Toggle
          area-label='Bold'
          pressed={isBold}
          onPressedChange={(
            pressed: boolean | ((prevState: boolean) => boolean)
          ) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            setIsBold(pressed);
          }}
        >
          <Bold />
        </Toggle>

        <Toggle
          area-label='Italic'
          pressed={isItalic}
          onPressedChange={(
            pressed: boolean | ((prevState: boolean) => boolean)
          ) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            setIsItalic(pressed);
          }}
        >
          <Italic />
        </Toggle>

        <Toggle
          area-label='Underline'
          pressed={isUnderline}
          onPressedChange={(
            pressed: boolean | ((prevState: boolean) => boolean)
          ) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            setIsUnderline(pressed);
          }}
        >
          <UnderlineIcon />
        </Toggle>
        <Toggle
          area-label='Strikethrough'
          pressed={isStrikethrough}
          onPressedChange={(
            pressed: boolean | ((prevState: boolean) => boolean)
          ) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            setIsStrikethrough(pressed);
          }}
        >
          <Strikethrough />
        </Toggle>
      </div>
    </div>
  );
}
