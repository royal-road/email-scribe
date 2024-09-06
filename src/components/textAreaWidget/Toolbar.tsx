import { FORMAT_TEXT_COMMAND, RangeSelection } from 'lexical';
import {
  Bold,
  Italic,
  Link,
  Strikethrough,
  Trash,
  UnderlineIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Toggle } from '../toggle';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import { $isAtNodeEnd } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Button } from '../button';
import { makeFullyQualifiedUrl } from './utils';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const node = getSelectedNode(selection);
      const parent = node?.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
        setIsLink(true);
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setIsLink(true);
      } else {
        setLinkUrl('');
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {}, [isLink, linkUrl]);

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

  function getSelectedNode(selection: RangeSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
  }

  const insertUpdateLink = useCallback(() => {
    editor.dispatchCommand(
      TOGGLE_LINK_COMMAND,
      makeFullyQualifiedUrl(linkUrl) || 'https://'
    );
    setLinkUrl(makeFullyQualifiedUrl(linkUrl));
    setIsLinkModalOpen(false);
  }, [editor, isLink, linkUrl]);

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
        <Popover open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
          <PopoverTrigger asChild>
            <Button
              size='icon'
              variant={isLink ? 'default' : 'outline'}
              style={{ border: 0, width: '2rem', height: '2rem' }}
              onClick={() => setIsLinkModalOpen(true)}
            >
              <Link />
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <input
                type='url'
                placeholder='Enter URL'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    insertUpdateLink();
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <Button onClick={insertUpdateLink} style={{ flex: '1' }}>
                  {isLink ? 'Update Link' : 'Insert Link'}
                </Button>
                {isLink && (
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => {
                      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                      setIsLinkModalOpen(false);
                    }}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
