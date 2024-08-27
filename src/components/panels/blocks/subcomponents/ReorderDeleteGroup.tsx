import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { Button } from '../../../ui/button';
import { ConfirmButton } from '../../../ui/ConfirmButton';

export interface Breakpoints {
  isTop: boolean;
  isBottom: boolean;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}

export default function ReorderDeleteGroup({
  isTop,
  isBottom,
  onUp,
  onDown,
  onDelete,
}: Breakpoints) {
  return (
    <div className='BreakpointToggleGroup'>
      <Button
        title='Move this block up'
        variant='outline'
        disabled={isTop}
        onClick={onUp}
        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        size='icon'
      >
        <ArrowUp
          className=''
          style={{ marginRight: '0.125rem', marginLeft: '0.125rem' }}
        />
      </Button>
      <Button
        title='Move this block down'
        variant='outline'
        disabled={isBottom}
        onClick={onDown}
        style={{ borderRadius: 0 }}
        size='icon'
      >
        <ArrowDown
          style={{
            marginRight: '0.125rem',
            marginLeft: '0.125rem',
          }}
        />
      </Button>
      <ConfirmButton
        title='Press twice to delete.'
        onConfirm={onDelete}
        initialText=''
        confirmText=''
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
        size='icon'
        initialIcon={
          <X style={{ marginRight: '0.125rem', marginLeft: '0.125rem' }} />
        }
        confirmIcon={
          <X style={{ marginRight: '0.125rem', marginLeft: '0.125rem' }} />
        }
      />
    </div>
  );
}
