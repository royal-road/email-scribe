import { ReactNode, useRef, useState } from 'react';
import { BlocksPanel, CollapsibleFocusProps } from './panels/blocks';
import PreviewPanel from './panels/preview';
import { useTheme } from './hooks/useTheme';
import './styles.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UndoRedoProvider } from './contexts/UndoRedoContext';
import { ConfigProvider } from './contexts/ConfigContext';
import './panels/blocks/utils/emailScribeGlobals';
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
  ABTestMode?: 'None' | 'A' | 'B';
  iconComponent?: ReactNode;
  presetMode?: PresetMode;
  title?: string;
  ctaOne?: CTAProps;
  ctaTwo?: CTAProps;
  scribeId: string;
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        config={{
          apiUrl: props.apiUrl,
          basePath: props.basePath,
          templatesToFetch: props.templatesToFetch,
        }}
        containerRef={containerRef}
      >
        <UndoRedoProvider scribeId={props.scribeId}>
          <div
            id={`newsletterDesignerRoot-${props.scribeId}`}
            data-theme={theme}
            className='newsletterDesigner bg-background text-foreground'
            ref={containerRef}
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
                  ABTestMode: props.ABTestMode ?? 'None',
                  scribeId: props.scribeId,
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
