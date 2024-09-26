import PreviewPanelHeader from '@/panels/preview/subcomponents/Header';
import PreviewPanelBody from '@/panels/preview/subcomponents/Body';
import { useState } from 'react';
import { CollapsibleFocusProps } from '@/panels/blocks';
import { useKeyboardShortcuts } from '@/hooks/keyboardShortcuts';

interface PreviewPanelProps {
  htmlToPreview: string;
  setBlockToFocus: (blockToFocus: CollapsibleFocusProps | null) => void;
  nonce?: string;
}
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlToPreview,
  setBlockToFocus,
  nonce,
}) => {
  useKeyboardShortcuts();
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );
  return (
    <div className='PreviewPanel'>
      <PreviewPanelHeader
        bp={{ breakpoint, onBreakpointChange: setBreakpoint }}
      />
      <PreviewPanelBody
        htmlToPreview={htmlToPreview}
        breakpoint={breakpoint}
        setBlockToFocus={setBlockToFocus}
        nonce={nonce}
      />
    </div>
  );
};

export default PreviewPanel;
