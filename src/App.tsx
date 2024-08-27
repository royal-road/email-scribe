import { useState } from 'react';
import { BlocksPanel } from './components/panels/blocks';
import PreviewPanel from './components/panels/preview';
import { useTheme } from './hooks/useTheme';
import './styles/styles.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const theme = useTheme();
  const [html, setHtml] = useState('');
  return (
    <QueryClientProvider client={queryClient}>
      <div
        id='newsletterDesignerRoot'
        data-theme={theme}
        className='newsletterDesigner bg-background text-foreground'
      >
        <div className='container'>
          <BlocksPanel onUpdateFinalHtml={setHtml} />
          <PreviewPanel htmlToPreview={html} />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
