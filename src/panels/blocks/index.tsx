import { BlockRenderer } from '@/panels/blocks/subcomponents/Renderer';
import { useState, useCallback, useRef, useEffect } from 'react';
import { BlockInterface } from '@/parser/setup/Types';
import debounce from 'debounce';
import { ScrollArea } from '@components/scrollArea';
import { BlockInstantiator } from '@/panels/blocks/subcomponents/Instantiator';
import autoAnimate from '@formkit/auto-animate';
import { BlockGlobalSettings } from '@/panels/blocks/subcomponents/GlobalSettings';
import { RRLogo } from '@components/RRLogo';
import { ScaffoldingBlock } from '@/parser/baseTemplates/Scaffolding';
import ActionManager from '@/panels/blocks/managers/ActionsManager';
import PresetManager, { Preset } from '@/panels/blocks/managers/PresetManager';
import SelectionManager from '@/panels/blocks/managers/SelectionManager';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { EmailScribeUIProps, PresetMode } from '@/EmailScribe';
import { Collapsible } from '@/components/collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Button } from '@/components/button';
import { ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
  UIProps: EmailScribeUIProps;
  preloadPreset?: string;
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
  UIProps,
  preloadPreset,
}) => {
  const instance = new ScaffoldingBlock() as BlockInterface;
  const [blocks, setBlocks] = useState<BlockState[]>([
    {
      instance,
      data: instance.formData,
      cachedHtml: instance.generateHTML(instance.id),
    },
  ]);
  const [blockAttributes, setBlockAttributes] = useState<BlockAttributes>({
    [instance.id]: { isOpen: false, isSelected: false, isSsr: false },
  });
  const { useEditorStore } = useUndoRedo();
  const { createHistory, history } = useEditorStore();
  const isInitialMount = useRef(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  useEffect(() => {
    createHistory(blocks);
  }, []);

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setBlocks(history);
      // setBlockAttributes(history.attributes);
    }
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
    if (
      blockAttributes[blockId] === undefined ||
      blocks[0].instance.id === blockId
    ) {
      return;
    }
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isOpen: open },
    }));
  };

  const getIsSSR = (blockId: string) => {
    return blockAttributes[blockId]?.isSsr;
  };

  const setSSR = (blockId: string, ssr: string | false) => {
    if (
      blockAttributes[blockId] === undefined ||
      blocks[0].instance.id === blockId
    ) {
      return;
    }
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isSsr: ssr },
    }));
  };

  const setCollapsibleSelectedState = (blockId: string, selected: boolean) => {
    if (
      blockAttributes[blockId] === undefined ||
      blocks[0].instance.id === blockId
    ) {
      return;
    }
    setBlockAttributes((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], isSelected: selected },
    }));
  };

  const animateParent = useRef(null);

  const updateRenderedHtml = () => {
    if (blocks.length <= 1) {
      // Handle the case when there are no blocks
      onUpdateFinalHtml('');
      return '';
    }

    const [firstBlock, ...restBlocks] = blocks;

    const blockContent: string[] = restBlocks.map((block) => {
      let html = block.cachedHtml;
      const isSsr = getIsSSR(block.instance.id);
      if (isSsr) {
        const prefix = `<div templateId="${isSsr}">`;
        const suffix = `</div>`;
        html = `${prefix}${html}${suffix}`;
      }
      return html;
    });

    const finHtml = blockContent.join('');

    // Update the first block's form data
    firstBlock.instance.updateFormData({
      ...firstBlock.data,
      blocks: finHtml,
    });

    // Generate the final HTML using the first block's instance
    const finalHtml = firstBlock.instance.generateHTML();
    onUpdateFinalHtml(finalHtml);
    return finalHtml;
  };

  useEffect(() => {
    updateRenderedHtml();
  }, [blocks]);

  const updateBlockDefaultHtml = (index: number, newHtml: string) => {
    setBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map((block, i) => {
        if (i === index) {
          block.instance.defaultHtml = newHtml;
          block.cachedHtml = block.instance.generateHTML(block.instance.id);
          return block;
        }
        return block;
      });
      debouncedCreateHistory(newBlocks);
      return newBlocks;
    });
    updateRenderedHtml();
  };

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        {UIProps.iconComponent ? (
          UIProps.iconComponent
        ) : (
          <RRLogo style={{ width: '4rem' }} />
        )}
        <div
          style={{
            width: '1px',
            height: '2rem',
            background: 'var(--foreground)',
          }}
        ></div>
        <h2 className='PanelHeading' style={{ margin: 0 }}>
          {UIProps.title || 'Email Scribe'}
        </h2>
      </div>
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '3rem',
            gap: '0.3rem',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <input
            type='text'
            placeholder='Subject/Title'
            value={
              UIProps.ABTestMode == 'None' || UIProps.ABTestMode == 'A'
                ? (blocks[0].data['subject'] as string)
                : '(Set in Editor A)'
            }
            onChange={(e) => {
              updateBlockData(0, { subject: e.target.value });
            }}
            disabled={UIProps.ABTestMode == 'B'}
            style={{
              flex: 3,
              height: '3rem',
              padding: '0 1rem',
              minWidth: '180px',
            }}
          />
          <CollapsibleTrigger asChild>
            <Button
              size='icon'
              style={{
                padding: 0,
                minWidth: '3rem',
                maxWidth: '3rem',
                minHeight: '3rem',
                maxHeight: '3rem',
              }}
            >
              {settingsOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
          <BlockInstantiator addBlock={addBlock} />
          <BlockGlobalSettings
            blocks={blocks}
            debouncedHistoryUpdate={debouncedCreateHistory}
            setBlocks={setBlocks}
            removeBlocks={removeBlocks}
            getSsr={getIsSSR}
            setSsr={setSSR}
            indexOfSelectedBlocks={Object.keys(blockAttributes)
              .filter((id) => blockAttributes[id]?.isSelected)
              .map((id) =>
                blocks.findIndex((block) => block.instance.id === id)
              )}
            updateBlockDefaultHtml={updateBlockDefaultHtml}
          />
        </div>
        <CollapsibleContent>
          {/* A label and input for id (from scaffoldsettings as well) then a label textArea for PlainText  */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
            }}
            className='CollapsibleRepository'
          >
            {UIProps.ABTestMode == 'None' && (
              <>
                <label htmlFor='id'>ID</label>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.2rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <input
                    type='text'
                    id='id'
                    value={blocks[0].data['id'] as string}
                    onChange={(e) => {
                      updateBlockData(0, { id: e.target.value });
                    }}
                    style={{ flex: 1, height: '2.5rem' }}
                  />
                  <Button
                    size='icon'
                    onClick={() =>
                      updateBlockData(0, {
                        id: uuidv4(),
                      })
                    }
                    title='Generate new ID (Use when creating new template using old preset as base)'
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              </>
            )}
            <label htmlFor='plainText'>Plain Text Version</label>
            <textarea
              id='plainText'
              value={blocks[0].data['plainText'] as string}
              onChange={(e) => {
                updateBlockData(0, { plainText: e.target.value });
              }}
              style={{ height: '15rem', resize: 'vertical' }}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

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
          {blocks.map(
            (block, index) =>
              index > 0 && ( // Hide the sold block
                <BlockRenderer
                  isTop={index === 1}
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
                      !blockAttributes[id]?.isSelected
                    );
                  }}
                  toggleOpen={() => toggleCollapsibleOpen(block.instance.id)}
                  onChange={(newData) => updateBlockData(index, newData)}
                  inSelectionMode={Object.keys(blockAttributes).some(
                    (id) => blockAttributes[id]?.isSelected
                  )}
                  isSsr={blockAttributes[block.instance.id]?.isSsr}
                />
              )
          )}
        </div>
      </ScrollArea>
      <PresetManager
        preloadPreset={preloadPreset}
        presetMode={UIProps.presetMode || PresetMode.Default}
        // key={blocks[0].data['subject'] as string}  // Commenting this causes the popup name to NOT match the subject, but leaving it causes re-rendering of the entire panel (and re-preloading of the preset that destroys the current state).
        presetTitle={blocks[0].data['subject'] as string}
        getBlocks={() => JSON.stringify(blocks)}
        setBlocks={setBlocks}
        getBlockAttributes={() => JSON.stringify(blockAttributesArray())}
        setBlockAttributes={setBlockAttributes}
        addToHistory={createHistory}
      />
      <ActionManager
        getHtml={() => (blocks.length > 0 ? updateRenderedHtml() : '')}
        getScaffold={() => ({
          id: blocks[0].data['id'] as string,
          subject: blocks[0].data['subject'] as string,
          plainText: blocks[0].data['plainText'] as string,
        })}
        getPreset={() =>
          ({
            presetName: blocks[0].data['subject'] as string,
            blockState: JSON.stringify(blocks),
            blockAttributes: JSON.stringify(blockAttributesArray()),
          }) as Preset
        }
        UIProps={UIProps}
      />
    </div>
  );
};
