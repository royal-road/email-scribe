import { useState } from 'react';
import { BlocksPanel, CollapsibleFocusProps } from './panels/blocks';
import PreviewPanel from './panels/preview';
import { useTheme } from './hooks/useTheme';
import './styles.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UndoRedoProvider } from './UndoRedoContext';

const queryClient = new QueryClient();

function App() {
  const theme = useTheme();
  const [html, setHtml] = useState('');
  const [blockToFocus, setBlockToFocus] =
    useState<CollapsibleFocusProps | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <UndoRedoProvider>
        <div
          id='newsletterDesignerRoot'
          data-theme={theme}
          className='newsletterDesigner bg-background text-foreground'
        >
          <div className='container'>
            <BlocksPanel
              onUpdateFinalHtml={setHtml}
              blockToFocus={blockToFocus}
            />
            <PreviewPanel
              htmlToPreview={html}
              setBlockToFocus={setBlockToFocus}
            />
          </div>
        </div>
      </UndoRedoProvider>
    </QueryClientProvider>
  );
}

export default App;
