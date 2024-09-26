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

export interface CTAProps {
  label?: string;
  icon?: ReactNode;
  action?(
    subject: string,
    id: string,
    plainText: string,
    html: string,
    preset: string
  ): void;
  hidden?: boolean;
}

export enum PresetMode {
  Default,
  LocalOnly,
  RemoteOnly,
}

export interface EmailScribeUIProps {
  iconComponent?: ReactNode;
  presetMode?: PresetMode;
  title?: string;
  ctaOne?: CTAProps;
  ctaTwo?: CTAProps;
}

export interface EmailScribeConfigProps {
  apiUrl: string;
  basePath: string;
  templatesToFetch: string[];
  preloadPreset?: string;
  nonce?: string;
}

export interface EmailScribeProps
  extends EmailScribeConfigProps,
    EmailScribeUIProps {}

export function EmailScribe(props: EmailScribeProps) {
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
                preloadPreset={props.preloadPreset}
                onUpdateFinalHtml={setHtml}
                blockToFocus={blockToFocus}
                UIProps={{
                  presetMode: props.presetMode,
                  iconComponent: props.iconComponent,
                  title: props.title,
                  ctaOne: props.ctaOne,
                  ctaTwo: props.ctaTwo,
                }}
              />
              <PreviewPanel
                htmlToPreview={html}
                setBlockToFocus={setBlockToFocus}
                nonce={props.nonce}
              />
            </div>
          </div>
        </UndoRedoProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
