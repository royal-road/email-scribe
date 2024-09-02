import { useState } from 'react';
import { Button } from '../../../ui/button';
import { MoonStar, Redo2, Sun, Undo2 } from 'lucide-react';
import BreakpointToggleGroup, { Breakpoints } from './BreakpointToggleGroup';
import { useUndoRedo } from '../../../../UndoRedoContext';

export interface PreviewPanelHeaderProps {
  bp: Breakpoints;
}

const PreviewPanelHeader: React.FC<PreviewPanelHeaderProps> = ({ bp }) => {
  const [theme, setTheme] = useState<boolean>(false);

  const handleThemeChange = () => {
    const root = document.querySelector('#newsletterDesignerRoot');
    root?.setAttribute('data-theme', !theme ? 'light' : 'dark');
    setTheme((theme) => !theme);
  };
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  return (
    <div className='PreviewPanelHeader'>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <h4>Preview</h4>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            title='Undo'
            onClick={() => undo()}
            variant='outline'
            size='icon'
            disabled={!canUndo}
          >
            <Undo2 />
          </Button>
          <Button
            title='Redo'
            onClick={() => redo()}
            variant='outline'
            size='icon'
            disabled={!canRedo}
          >
            <Redo2 />
          </Button>
        </div>
        <BreakpointToggleGroup
          breakpoint={bp.breakpoint}
          onBreakpointChange={(breakpoint) => bp.onBreakpointChange(breakpoint)}
        />
        <Button
          title='Toggle Theme'
          onClick={() => handleThemeChange()}
          variant='outline'
          size='icon'
        >
          {theme ? <Sun /> : <MoonStar />}
        </Button>
      </div>
    </div>
  );
};

export default PreviewPanelHeader;
