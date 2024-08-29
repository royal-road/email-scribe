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

export interface openStates {
  [key: string]: { isOpen: boolean; isSelected: boolean };
}

export const BlocksPanel: React.FC<BlockPanelProps> = ({
  onUpdateFinalHtml,
  blockToFocus,
}) => {
  const [blocks, setBlocks] = useState<BlockState[]>([]);
  const [collapsibleStates, setCollapsibleStates] = useState<openStates>({});
  const [scaffoldSettings] = useState<BlockState>(() => {
    const instance = new ScaffoldingBlock() as BlockInterface;
    return {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(instance.id),
    };
  });

  useEffect(() => {
    // console.log('focus block', blockToFocus);
    if (
      blockToFocus &&
      Object.hasOwn(collapsibleStates, blockToFocus.collapsibleId)
    ) {
      // setAllCollapsibles(false);
      setCollapsibleState(blockToFocus.collapsibleId, true);
      // Now focus on the field by scrolling to it
      const fieldId = `${blockToFocus.collapsibleId}_${blockToFocus.fieldId}`;
      const tryToScrollHere = (id: string) => {
        const field = document.getElementById(id);
        field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field?.focus();
        return Boolean(field);
      };

      // Try to scroll to the field a few times
      if (!tryToScrollHere(fieldId)) {
        setTimeout(() => {
          if (!tryToScrollHere(fieldId)) {
            setTimeout(() => {
              if (!tryToScrollHere(fieldId)) {
                setTimeout(() => {
                  if (!tryToScrollHere(fieldId)) {
                    setTimeout(() => {
                      if (!tryToScrollHere(fieldId)) {
                        console.error('Could not scroll to field', fieldId);
                      }
                    }, 500);
                  }
                }, 400);
              }
            }, 300);
          }
        }, 200);
      }
    }
  }, [blockToFocus]);

  const toggleCollapsibleOpen = (collapsibleId: string) => {
    setCollapsibleStates((prev) => ({
      ...prev,
      [collapsibleId]: {
        ...prev[collapsibleId],
        isOpen: !prev[collapsibleId].isOpen,
      },
    }));
  };

  const setCollapsibleState = (collapsibleId: string, open: boolean) => {
    setCollapsibleStates((prev) => ({
      ...prev,
      [collapsibleId]: { ...prev[collapsibleId], isOpen: open },
    }));
  };

  const setCollapsibleSelectedState = (
    collapsibleId: string,
    selected: boolean
  ) => {
    setCollapsibleStates((prev) => ({
      ...prev,
      [collapsibleId]: { ...prev[collapsibleId], isSelected: selected },
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
    setCollapsibleStates((prev) => ({
      ...prev,
      [block.id]: { ...prev[block.id], isOpen: false },
    })); // Open the block when added
  };

  const removeBlock = (index: number) => {
    try {
      console.log('remove block', index);
      setBlocks((prev) => {
        setCollapsibleStates((prevStates) => {
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
        setCollapsibleStates((prevStates) => {
          delete prevStates[prev[index].instance.id];
          return prevStates;
        });
      });
      const newBlocks = prev.filter((_, i) => !indices.includes(i));
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
          indexOfSelectedBlocks={Object.keys(collapsibleStates)
            .filter((id) => collapsibleStates[id].isSelected)
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
            Object.keys(collapsibleStates).forEach((id) => {
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
            Object.keys(collapsibleStates).forEach((id) => {
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
            Object.keys(collapsibleStates).forEach((id) => {
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
            Object.keys(collapsibleStates).forEach((id) => {
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
              isOpen={collapsibleStates[block.instance.id]?.isOpen}
              isSelected={collapsibleStates[block.instance.id]?.isSelected}
              toggleSelect={(id: string) => {
                setCollapsibleSelectedState(
                  id,
                  !collapsibleStates[id].isSelected
                );
              }}
              toggleOpen={() => toggleCollapsibleOpen(block.instance.id)}
              onChange={(newData) => updateBlockData(index, newData)}
              inSelectionMode={Object.keys(collapsibleStates).some(
                (id) => collapsibleStates[id].isSelected
              )}
            />
          ))}
        </div>
      </ScrollArea>
      <PresetManager
        getBlocks={() => JSON.stringify(blocks)}
        setBlocks={setBlocks}
        setOpenStates={setCollapsibleStates}
      />
      <HtmlManager
        getHtml={() => (blocks.length > 0 ? updateRenderedHtml() : '')}
      />
    </div>
  );
};
