import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { $getRoot, EditorState } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { registerCodeHighlighting } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import theme from './theme';

function CodeHighlightPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}

function InitialValuePlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      if ($getRoot().getTextContent() === initialValue) return;
      root.clear();
      $convertFromMarkdownString(`\`\`\`html\n${initialValue}\n\`\`\``);
    });
  }, [initialValue, editor]);

  return null;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  // id,
  // disabled = false,
  // readonly = false,
}) => {
  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      // const root = $getRoot();
      const result = $getRoot().getTextContent();
      if (result === value) return;
      const cleanedResult = result.replace(/&nbsp;/g, ' ');
      onChange(cleanedResult);
    });
  };
  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'editor',
        theme: theme,
        onError: (error: unknown) => {
          throw error;
        },
        nodes: [CodeNode, CodeHighlightNode],
        editable: true,
      }}
    >
      <InitialValuePlugin initialValue={value} />
      <div>
        <RichTextPlugin
          contentEditable={<ContentEditable className='codeEditorInput' />}
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
      <CodeHighlightPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
