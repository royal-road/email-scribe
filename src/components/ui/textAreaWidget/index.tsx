// Most stuff pulled from here: https://codesandbox.io/p/sandbox/vigilant-kate-5tncvy?file=%2Fsrc%2Fthemes%2FExampleTheme.js%3A67%2C3
// And here: https://lexical.dev/docs/concepts/serialization

import React, { useCallback, useEffect } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, EditorState, LexicalEditor, $insertNodes } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';
import ToolbarPlugin from './Toolbar';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { baseLexicalTheme } from './theme';
import AutoLinkPlugin from './AutoLinkPlugin';

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
      const htmlString = $generateHtmlFromNodes(editor);
      if (htmlString === initialValue) return;

      const parser = new DOMParser();
      const dom = parser.parseFromString(initialValue, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $getRoot().clear();
      $insertNodes(nodes);
    });
  }, [initialValue]);

  return null;
}

export const LexicalWidget: React.FC<WidgetProps> = (props) => {
  const { onChange, value, id, disabled, readonly } = props;

  const handleChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      editorState.read(() => {
        // const root = $getRoot();
        const htmlString = $generateHtmlFromNodes(editor);
        // console.log(htmlString);
        if (htmlString === value) return;
        console.log('onChange', htmlString);
        onChange(htmlString);
      });
    },
    [onChange]
  );

  const initialConfig: InitialConfigType = {
    namespace: 'RJSFEditor',
    theme: baseLexicalTheme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, AutoLinkNode, LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
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
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
      {/* <HistoryPlugin /> */}
      <LinkPlugin />
      <AutoLinkPlugin />
      <AutoFocusPlugin />
      <InitialValuePlugin initialValue={value || ''} />
    </LexicalComposer>
  );
};
