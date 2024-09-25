import { BlockAttributes } from '@/panels/blocks';

function SelectionManager({
  blockCount,
  blockAttributes,
  setCollapsibleSelectedState,
  setCollapsibleState,
}: {
  blockCount: number;
  blockAttributes: BlockAttributes;
  setCollapsibleSelectedState: (blockId: string, selected: boolean) => void;
  setCollapsibleState: (blockId: string, open: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: '1rem',
        width: '100%',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: '0.5rem',
      }}
    >
      <button
        className='link-text'
        disabled={blockCount === 1}
        onClick={() => {
          Object.keys(blockAttributes).forEach((id) => {
            setCollapsibleSelectedState(id, true);
          });
        }}
      >
        Select all
      </button>
      <button
        className='link-text'
        disabled={blockCount === 1}
        onClick={() => {
          Object.keys(blockAttributes).forEach((id) => {
            setCollapsibleSelectedState(id, false);
          });
        }}
      >
        Unselect all
      </button>
      <button
        className='link-text'
        disabled={blockCount === 1}
        onClick={() => {
          Object.keys(blockAttributes).forEach((id) => {
            setCollapsibleState(id, true);
          });
        }}
      >
        Expand all
      </button>
      <button
        className='link-text'
        disabled={blockCount === 1}
        onClick={() => {
          Object.keys(blockAttributes).forEach((id) => {
            setCollapsibleState(id, false);
          });
        }}
      >
        Collpase all
      </button>
    </div>
  );
}

export default SelectionManager;
