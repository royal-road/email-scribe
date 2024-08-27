import { BlockRenderer } from './subcomponents/BlockRenderer';
import { useState, useCallback, useRef, useEffect } from 'react';
import { BlockInterface } from '../../../blocks/setup/Types';
import debounce from 'debounce';
import { ScrollArea } from '../../ui/scrollArea';
import { BlockSelector } from './subcomponents/BlockSelector';
import autoAnimate from '@formkit/auto-animate';
import { BlockGlobalSettings } from './subcomponents/BlockGlobalSettings';
import { RRLogo } from '../../ui/RRLogo';
import { ScaffoldingBlock } from '../../../blocks/Scaffolding';
import CopyToClip from './subcomponents/CopyToClip';
import { usePresetManager } from './hooks/presets';
import PresetManager from './subcomponents/PresetManager';

export interface BlockState {
  instance: BlockInterface;
  data: object;
  cachedHtml: string;
}

interface BlockPanelProps {
  onUpdateFinalHtml: (html: string) => void;
}

export const BlocksPanel: React.FC<BlockPanelProps> = ({
  onUpdateFinalHtml,
}) => {
  const presetManager = usePresetManager();
  const [blocks, setBlocks] = useState<BlockState[]>([]);
  const [scaffoldSettings, setScaffoldSettings] = useState<BlockState>(() => {
    const instance = new ScaffoldingBlock() as BlockInterface;
    return {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(),
    };
  });

  const animateParent = useRef(null);

  const updateRenderedHtml = () => {
    const blockContent: string[] = [];
    blocks.map((block) => blockContent.push(block.cachedHtml));
    const finHtml = blockContent.join('');
    scaffoldSettings.instance.updateFormData({
      ...scaffoldSettings.data,
      blocks: finHtml,
    });
    const finalHtml = scaffoldSettings.instance.generateHTML();
    // console.log("final html", finalHtml);
    onUpdateFinalHtml(finalHtml);
    return finalHtml;
  };

  useEffect(() => {
    updateRenderedHtml();
  }, [blocks, scaffoldSettings]);

  const debouncedSetScaffoldSettings = useCallback(
    debounce((newSettings) => {
      setScaffoldSettings(newSettings);
    }, blocks.length + 5),
    []
  );

  const updateBlockData = useCallback(
    debounce((index: number, newData: object) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block, i) => {
          if (i === index) {
            const updatedData = { ...block.data, ...newData };
            block.instance.updateFormData(updatedData);
            block.cachedHtml = block.instance.generateHTML(); // This ensures only the block that was updated is re-rendered
            return { ...block, data: updatedData };
          }
          return block;
        })
      );
    }, blocks.length + 5), // Debounce more based on whether there's more blocks
    []
  );

  const addBlock = (block: BlockInterface) => {
    // const newBlockInstance = BlockFactory.createBlock(type);
    setBlocks((prev) => [
      ...prev,
      {
        instance: block,
        data: block.formData,
        cachedHtml: block.generateHTML(),
      },
    ]);
  };

  const removeBlock = (index: number) => {
    console.log('remove block', index);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 1);
      return newBlocks;
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    console.log('move block', index, direction);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const block = newBlocks[index];
      newBlocks.splice(index, 1);
      newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, block);
      return newBlocks;
    });
    // updateBlockData(index, {});
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    animateParent.current && autoAnimate(animateParent.current);
  }, [animateParent]);

  const handleCallToAction = () => {
    presetManager.savePreset.mutate({
      presetName: 'newsletter',
      data: JSON.stringify(blocks),
    });
  };

  const copyToClipboard = () => {
    if (blocks.length === 0) {
      navigator.clipboard.writeText('');
      return;
    }
    navigator.clipboard.writeText(updateRenderedHtml());
  };

  return (
    <div className='BlocksPanel'>
      <RRLogo style={{ width: '4rem', marginBottom: '2rem' }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '3rem',
          gap: '0.5rem',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <h2 className='PanelHeading'>Newsletter Designer</h2>
        <BlockSelector addBlock={addBlock} />
        <BlockGlobalSettings
          scaffoldSettings={scaffoldSettings}
          setScalfoldSettings={debouncedSetScaffoldSettings}
        />
      </div>
      <ScrollArea className='blocks'>
        {blocks.length === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <p style={{ fontWeight: 200, fontSize: '1.4rem' }}>
              Click the "+" button to add a block
            </p>
          </div>
        )}
        <div ref={animateParent}>
          {blocks.map((block, index) => (
            <BlockRenderer
              isTop={index === 0}
              isBottom={index === blocks.length - 1}
              onDelete={() => removeBlock(index)}
              onUp={() => moveBlock(index, 'up')}
              onDown={() => moveBlock(index, 'down')}
              key={`block${block.instance.id}`}
              block={block.instance}
              data={block.data}
              onChange={(newData) => updateBlockData(index, newData)}
            />
          ))}
        </div>
      </ScrollArea>
      <PresetManager
        getBlocks={() => JSON.stringify(blocks)}
        setBlocks={setBlocks}
      />
      <CopyToClip onClick={copyToClipboard} />
    </div>
  );
};
