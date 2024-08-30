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
import HtmlManager from './subcomponents/HtmlManager';
import PresetManager from './subcomponents/PresetManager';

export interface BlockState {
  instance: BlockInterface;
  data: object;
  cachedHtml: string;
}

export interface CollapsibleFocusProps {
  collapsibleId: string;
  fieldId: string;
}

interface BlockPanelProps {
  onUpdateFinalHtml: (html: string) => void;
  blockToFocus: CollapsibleFocusProps | null;
}

export interface BlockAttribute {
  isOpen: boolean;
  isSelected: boolean;
  isSsr: string | false;
}

export interface BlockAttributes {
  [key: string]: BlockAttribute;
}

export const BlocksPanel: React.FC<BlockPanelProps> = ({
  onUpdateFinalHtml,
  blockToFocus,
}) => {
  const [blocks, setBlocks] = useState<BlockState[]>([]);
  const [blockAttributes, setBlockAttributes] = useState<BlockAttributes>({});
  const [scaffoldSettings] = useState<BlockState>(() => {
    const instance = new ScaffoldingBlock() as BlockInterface;
    return {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(instance.id),
    };
  });

  useEffect(() => {
    if (
      blockToFocus &&
      Object.hasOwn(blockAttributes, blockToFocus.collapsibleId)
    ) {
      setCollapsibleState(blockToFocus.collapsibleId, true);

      const fieldId = `${blockToFocus.collapsibleId}_${blockToFocus.fieldId}`;

      const scrollToField = (
        id: string,
        block: ScrollLogicalPosition = 'center'
      ): boolean => {
        const field = document.getElementById(id);
        if (field) {
          field.scrollIntoView({ behavior: 'smooth', block: block });
          field.focus();
          return true;
        }
        return false;
      };
      let hasFailed = false;
      const attemptScroll = (attempts: number = 0) => {
        if (attempts >= 5) {
          // console.error('Could not scroll to field', fieldId);
          return;
        }

        if (scrollToField(fieldId)) {
          // If successful, scroll again after a short delay
          setTimeout(() => scrollToField(fieldId), 150);
        } else {
          // If unsuccessful, try again after a delay
          if (!hasFailed) {
            scrollToField(blockToFocus.collapsibleId, 'start');
            hasFailed = true;
          }
          setTimeout(() => attemptScroll(attempts + 1), 200 + 100 * attempts);
        }
      };

      attemptScroll();
    }
  }, [blockToFocus]);

  const toggleCollapsibleOpen = (blockId: string) => {
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        isOpen: !prev[blockId].isOpen,
      },
    }));
  };

  const setCollapsibleState = (blockId: string, open: boolean) => {
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isOpen: open },
    }));
  };

  const getIsSSR = (blockId: string) => {
    return blockAttributes[blockId]?.isSsr;
  };

  const setSSR = (blockId: string, ssr: string | false) => {
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isSsr: ssr },
    }));
  };

  const setCollapsibleSelectedState = (blockId: string, selected: boolean) => {
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isSelected: selected },
    }));
  };

  // const setAllCollapsibles = (open: boolean) => {
  //   const newStates = { ...openStates };
  //   Object.keys(newStates).forEach((key) => {
  //     newStates[key] = open;
  //   });
  //   setOpenStates(newStates);
  // };
  // const debouncedSetScaffoldSettings = useCallback(
  //   debounce((newSettings) => {
  //     setScaffoldSettings(newSettings);
  //   }, blocks.length + 5),
  //   []
  // );

  const animateParent = useRef(null);

  const updateRenderedHtml = () => {
    const blockContent: string[] = [];
    blocks.map((block) => blockContent.push(block.cachedHtml));
    const finHtml = blockContent.join('');
    scaffoldSettings.instance.updateFormData({
      ...scaffoldSettings.data,
      blocks: finHtml,
    });
    const finalHtml = scaffoldSettings.instance.generateHTML(
      scaffoldSettings.instance.id
    );
    // console.log("final html", finalHtml);
    onUpdateFinalHtml(finalHtml);
    return finalHtml;
  };

  useEffect(() => {
    updateRenderedHtml();
  }, [blocks, scaffoldSettings]);

  const updateBlockData = useCallback(
    debounce((index: number, newData: object) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block, i) => {
          if (i === index) {
            const updatedData = { ...block.data, ...newData };
            block.instance.updateFormData(updatedData);
            block.cachedHtml = block.instance.generateHTML(block.instance.id); // This ensures only the block that was updated is re-rendered
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
        cachedHtml: block.generateHTML(block.id),
      },
    ]);
    setBlockAttributes((prev) => ({
      ...prev,
      [block.id]: { isSelected: false, isOpen: false, isSsr: false },
    })); // Open the block when added
  };

  const removeBlock = (index: number) => {
    try {
      // console.log('remove block', index);
      setBlocks((prev) => {
        setBlockAttributes((prevStates) => {
          delete prevStates[removedBlock[0].instance.id];
          return prevStates;
        });
        const newBlocks = [...prev];
        const removedBlock = newBlocks.splice(index, 1);
        return newBlocks;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const removeBlocks = (indices: number[]) => {
    setBlocks((prev) => {
      indices.forEach((index) => {
        setBlockAttributes((prevStates) => {
          delete prevStates[prev[index].instance.id];
          return prevStates;
        });
      });
      const newBlocks = prev.filter((_, i) => !indices.includes(i));
      return newBlocks;
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    // console.log('move block', index, direction);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const block = newBlocks[index];
      newBlocks.splice(index, 1);
      newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, block);
      return newBlocks;
    });
    // updateBlockData(index, {});
  };

  const blockAttributesArray = () => {
    // I need to turn map to array, but the order might have changed so I need to look it up based on current order of each block and their instance id
    const blockOrder = blocks.map((block) => block.instance.id);
    // Now I can sort the blockAttributes based on the order of the blocks
    return blockOrder.map((id) => blockAttributes[id]);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    animateParent.current && autoAnimate(animateParent.current);
  }, [animateParent]);

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
          blocks={blocks}
          setBlocks={setBlocks}
          removeBlocks={removeBlocks}
          getSsr={getIsSSR}
          setSsr={setSSR}
          indexOfSelectedBlocks={Object.keys(blockAttributes)
            .filter((id) => blockAttributes[id].isSelected)
            .map((id) => blocks.findIndex((block) => block.instance.id === id))}
        />
      </div>
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
          disabled={blocks.length === 0}
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
          disabled={blocks.length === 0}
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
          disabled={blocks.length === 0}
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
          disabled={blocks.length === 0}
          onClick={() => {
            Object.keys(blockAttributes).forEach((id) => {
              setCollapsibleState(id, false);
            });
          }}
        >
          Collpase all
        </button>
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
              id={block.instance.id}
              block={block.instance}
              data={block.data}
              isOpen={blockAttributes[block.instance.id]?.isOpen}
              isSelected={blockAttributes[block.instance.id]?.isSelected}
              toggleSelect={(id: string) => {
                setCollapsibleSelectedState(
                  id,
                  !blockAttributes[id].isSelected
                );
              }}
              toggleOpen={() => toggleCollapsibleOpen(block.instance.id)}
              onChange={(newData) => updateBlockData(index, newData)}
              inSelectionMode={Object.keys(blockAttributes).some(
                (id) => blockAttributes[id].isSelected
              )}
            />
          ))}
        </div>
      </ScrollArea>
      <PresetManager
        getBlocks={() => JSON.stringify(blocks)}
        setBlocks={setBlocks}
        getBlockAttributes={() => JSON.stringify(blockAttributesArray())}
        setBlockAttributes={setBlockAttributes}
      />
      <HtmlManager
        getHtml={() => (blocks.length > 0 ? updateRenderedHtml() : '')}
      />
    </div>
  );
};
