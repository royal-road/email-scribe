import PreviewPanelHeader from './subcomponents/PreviewPanelHeader';
import PreviewPanelBody from './subcomponents/PreviewPanelBody';
import { useState } from 'react';
import { CollapsibleFocusProps } from '../blocks';
import { useKeyboardShortcuts } from '../../../hooks/keyboardShortcuts';

interface PreviewPanelProps {
  htmlToPreview: string;
  setBlockToFocus: (blockToFocus: CollapsibleFocusProps | null) => void;
}
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  htmlToPreview,
  setBlockToFocus,
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
      />
    </div>
  );
};

export default PreviewPanel;
