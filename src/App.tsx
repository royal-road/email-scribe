import { ReactNode, useState } from 'react';
import { BlocksPanel, CollapsibleFocusProps } from './panels/blocks';
import PreviewPanel from './panels/preview';
import { useTheme } from './hooks/useTheme';
import './styles.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UndoRedoProvider } from './contexts/UndoRedoContext';
import { ConfigProvider } from './contexts/ConfigContext';
// import { Pencil } from 'lucide-react';

const queryClient = new QueryClient();

export interface EmailScribeUIProps {
  iconComponent?: ReactNode;
  title?: string;
}

export interface EmailScribeProps {
  apiUrl: string;
  basePath: string;
  templatesToFetch: string[];
}

export function EmailScribe(props: EmailScribeProps & EmailScribeUIProps) {
  const theme = useTheme();
  const [html, setHtml] = useState('');
  const [blockToFocus, setBlockToFocus] =
    useState<CollapsibleFocusProps | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        config={{
          apiUrl: props.apiUrl,
          basePath: props.basePath,
          templatesToFetch: props.templatesToFetch,
        }}
      >
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
                UIProps={{
                  iconComponent: props.iconComponent,
                  title: props.title,
                }}
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
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={import.meta.env.VITE_TEMPLATE_ID.split(',')}
      // iconComponent={<Pencil size={48} style={{ marginBottom: '0.5rem' }} />}
      // title='Email Designer'
    />
  );
}

export default App;
