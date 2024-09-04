import React, { useCallback, useEffect } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';
import ToolbarPlugin from './toolbar';
const theme = {
  // Theme styling goes here
  // ...
};

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

function InitialValuePlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      if (root.getTextContent() === '') {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialValue));
        root.append(paragraph);
      }
    });
  }, [editor, initialValue]);

  return null;
}

export const LexicalWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, value, id, disabled, readonly } = props;

  const handleChange = useCallback(
    (editorState: any) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        onChange(text);
      });
    },
    [onChange]
  );

  const initialConfig: InitialConfigType = {
    namespace: 'RJSFEditor',
    theme,
    onError: (error: any) => console.error(error),
    nodes: [HeadingNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            id={id}
            className='editorInput'
            disabled={disabled || readonly}
          />
        }
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <InitialValuePlugin initialValue={value || ''} />
    </LexicalComposer>
  );
};
