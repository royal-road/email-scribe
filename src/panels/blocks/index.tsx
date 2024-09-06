import { BlockRenderer } from './subcomponents/Renderer';
import { useState, useCallback, useRef, useEffect } from 'react';
import { BlockInterface } from '@/blocks/setup/Types';
import debounce from 'debounce';
import { ScrollArea } from '@components/scrollArea';
import { BlockSelector } from './subcomponents/Instantiator';
import autoAnimate from '@formkit/auto-animate';
import { GlobalSettings } from '@/panels/blocks/subcomponents/GlobalSettings';
import { RRLogo } from '@components/RRLogo';
import { ScaffoldingBlock } from '@/blocks/Scaffolding';
import HtmlManager from '@/panels/blocks/managers/HtmlManager';
import PresetManager from '@/panels/blocks/managers/PresetManager';
import SelectionManager from '@/panels/blocks/managers/SelectionManager';
import { useEditorStore } from '@/hooks/undoRedoStore';

export interface BlockState {
  instance: BlockInterface;
  data: Record<string, unknown>;
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
  const { createHistory, history } = useEditorStore();
  const [scaffoldSettings] = useState<BlockState>(() => {
    const instance = new ScaffoldingBlock() as BlockInterface;
    return {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(instance.id),
    };
  });

  const debouncedCreateHistory = debounce((blocks: BlockState[]) => {
    // console.log(blocks, blockAttributes);
    createHistory(blocks);
  }, 1000);

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

  useEffect(() => {
    setBlocks(history);
    // setBlockAttributes(history.attributes);
  }, [history]);

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

  const animateParent = useRef(null);

  const updateRenderedHtml = () => {
    const blockContent: string[] = [];
    blocks.map((block) => {
      let html = block.cachedHtml;
      const isSsr = getIsSSR(block.instance.id);
      if (isSsr) {
        const prefix = `<div templateId="${isSsr}">`;
        const suffix = `</div>`;
        html = `${prefix}${html}${suffix}`;
      }
      blockContent.push(html);
    });
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
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block, i) => {
          if (i === index) {
            const updatedData = { ...block.data, ...newData };
            block.instance.updateFormData(updatedData);
            block.cachedHtml = block.instance.generateHTML(block.instance.id); // This ensures only the block that was updated is re-rendered
            return { ...block, data: updatedData };
          }
          return block;
        });

        // setTimeout(() => DebouncedUpdateHistory(newBlocks, blockAttributes), 0);
        debouncedCreateHistory(newBlocks);
        // updateHistory();
        return newBlocks;
      });
    }, blocks.length + 5), // Debounce more based on whether there's more blocks
    []
  );

  const addBlock = (block: BlockInterface) => {
    // const newBlockInstance = BlockFactory.createBlock(type);
    let newBlock: BlockState[] = [];
    let newBlockAttributes: BlockAttributes = {};
    setBlocks((prev) => {
      newBlock = [
        ...prev,
        {
          instance: block,
          data: block.formData,
          cachedHtml: block.generateHTML(block.id),
        },
      ];
      return newBlock;
    });
    setBlockAttributes((prev) => {
      newBlockAttributes = {
        ...prev,
        [block.id]: { isSelected: false, isOpen: false, isSsr: false },
      };
      return newBlockAttributes;
    }); // Open the block when added
    createHistory(newBlock);
  };

  const removeBlock = (index: number) => {
    let newBlocks: BlockState[] = [];
    try {
      // console.log('remove block', index);
      setBlocks((prev) => {
        setBlockAttributes((prevStates) => {
          delete prevStates[removedBlock[0]?.instance?.id];
          return prevStates;
        });
        newBlocks = [...prev];
        const removedBlock = newBlocks.splice(index, 1);
        return newBlocks;
      });
    } catch (e) {
      console.error(e);
    }
    createHistory(newBlocks);
  };

  const removeBlocks = (indices: number[]) => {
    let newBlocks: BlockState[] = [];
    setBlocks((prev) => {
      indices.forEach((index) => {
        setBlockAttributes((prevStates) => {
          delete prevStates[prev[index].instance.id];
          return prevStates;
        });
      });
      newBlocks = prev.filter((_, i) => !indices.includes(i));
      return newBlocks;
    });
    createHistory(newBlocks);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    let newBlocks: BlockState[] = [];
    setBlocks((prev) => {
      newBlocks = [...prev];
      const block = newBlocks[index];
      newBlocks.splice(index, 1);
      newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, block);
      return newBlocks;
    });
    createHistory(newBlocks);
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
        <GlobalSettings
          blocks={blocks}
          debouncedHistoryUpdate={debouncedCreateHistory}
          setBlocks={setBlocks}
          removeBlocks={removeBlocks}
          getSsr={getIsSSR}
          setSsr={setSSR}
          indexOfSelectedBlocks={Object.keys(blockAttributes)
            .filter((id) => blockAttributes[id].isSelected)
            .map((id) => blocks.findIndex((block) => block.instance.id === id))}
        />
      </div>
      <SelectionManager
        blockCount={blocks.length}
        blockAttributes={blockAttributes}
        setCollapsibleSelectedState={setCollapsibleSelectedState}
        setCollapsibleState={setCollapsibleState}
      />
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
              isSsr={blockAttributes[block.instance.id]?.isSsr}
            />
          ))}
        </div>
      </ScrollArea>
      <PresetManager
        getBlocks={() => JSON.stringify(blocks)}
        setBlocks={setBlocks}
        getBlockAttributes={() => JSON.stringify(blockAttributesArray())}
        setBlockAttributes={setBlockAttributes}
        addToHistory={createHistory}
      />
      <HtmlManager
        getHtml={() => (blocks.length > 0 ? updateRenderedHtml() : '')}
      />
    </div>
  );
};
