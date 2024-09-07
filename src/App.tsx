import { useState } from 'react';
import { BlocksPanel, CollapsibleFocusProps } from './panels/blocks';
import PreviewPanel from './panels/preview';
import { useTheme } from './hooks/useTheme';
import './styles.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UndoRedoProvider } from './contexts/UndoRedoContext';
import { ConfigProvider } from './contexts/ConfigContext';

const queryClient = new QueryClient();

export interface EmailScribeProps {
  apiUrl: string;
  basePath: string;
  templatesToFetch: string[];
}

export function EmailScribe(config: EmailScribeProps) {
  const theme = useTheme();
  const [html, setHtml] = useState('');
  const [blockToFocus, setBlockToFocus] =
    useState<CollapsibleFocusProps | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider config={config}>
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
      </ConfigProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <EmailScribe
      apiUrl='http://localhost:3002'
      basePath='email-scribe'
      templatesToFetch={['Boxed-01', 'Promotion-01', 'All-in-one']}
    />
  );
}

export default App;
