import React, { useEffect, useRef } from 'react';
import { Button } from '@components/button';
import { Popover, PopoverTrigger, PopoverContent } from '@components/popover';
import { usePresetManager } from '@/panels/blocks/hooks/presets';
import { BlockAttribute, BlockState } from '@/panels/blocks';
import { jsonToBlocks } from '@/panels/blocks/utils/blockInstancer';
import InputPopover from '@components/InputPopover';
import { ScrollArea } from '@components/scrollArea';
import { ConfirmButton } from '@components/ConfirmButton';
import {
  CloudDownload,
  CloudUpload,
  Download,
  PackageOpen,
  Trash,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  handleExport,
  handleFileImport,
  handleJsonImport,
} from '../utils/importExport';
import { useConfig } from '@/contexts/ConfigContext';
import { PresetMode } from '@/EmailScribe';

export interface Preset {
  presetName: string;
  blockState: string;
  blockAttributes: string;
}

interface PresetManagerProps {
  getBlocks: () => string;
  setBlocks: (blocks: BlockState[]) => void;
  getBlockAttributes: () => string;
  setBlockAttributes: (openStates: Record<string, BlockAttribute>) => void;
  addToHistory: (entry: BlockState[]) => void;
  presetTitle: string;
  presetMode: PresetMode;
  preloadPreset?: string;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  getBlocks,
  setBlocks,
  getBlockAttributes,
  setBlockAttributes,
  addToHistory,
  presetTitle,
  presetMode,
  preloadPreset,
}) => {
  const config = useConfig();
  // Only use preset query (within presetManager) if remote only or default
  const { presetsQuery, usePreset, savePreset, deletePreset, presetEndpoint } =
    usePresetManager(
      config,
      presetMode === PresetMode.RemoteOnly || presetMode === PresetMode.Default
    );
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedPresetName, setSelectedPresetName] = React.useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [donePreloading, setDonePreloading] = React.useState(false);

  const selectedPreset = usePreset(selectedPresetName || '', presetEndpoint);

  React.useEffect(() => {
    try {
      if (selectedPreset.data && selectedPreset.data.blockState) {
        const blockState = jsonToBlocks(selectedPreset.data.blockState, config);
        const blockAttributes = JSON.parse(
          selectedPreset.data.blockAttributes
        ) as BlockAttribute[];
        if (blockState) {
          blockState.forEach((block) => {
            block.cachedHtml = block.instance.generateHTML(block.instance.id);
          });
          setBlocks(blockState);
          const ids = blockState.map((block) => block.instance.id);
          const openStates: Record<string, BlockAttribute> = {};
          let index = 0;
          ids?.forEach((id) => {
            openStates[id] = blockAttributes[index];
            index++;
          });
          setBlockAttributes(openStates);
          addToHistory(blockState);
        }
        setSelectedPresetName(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedPreset.data, setBlocks, setBlockAttributes]);

  useEffect(() => {
    setTimeout(() => {
      if (preloadPreset && !donePreloading) {
        setDonePreloading(true);
        handleJsonImport(
          preloadPreset,
          setBlocks,
          setBlockAttributes,
          addToHistory,
          config
        );
      }
    }, 10);
  }, [preloadPreset]);

  const handleSavePreset = (presetName: string) => {
    const blockState = getBlocks();
    const blockAttributes = getBlockAttributes();
    const preset = { presetName, blockState, blockAttributes } as Preset;
    savePreset.mutate(preset);
  };

  const handlePresetSelect = (presetName: string) => {
    setSelectedPresetName(presetName);
    setIsPopoverOpen(false);
  };

  const handleDeletePreset = (presetName: string) => {
    deletePreset.mutate(presetName);
  };

  return (
    <div className='preset-manager-container'>
      <h6 className='preset-manager-title'>Presets</h6>
      <div className='preset-manager-buttons'>
        {(presetMode === PresetMode.LocalOnly ||
          presetMode === PresetMode.Default) && (
          <>
            <InputPopover
              triggerText='Export'
              icon={<Upload />}
              placeholder='Enter preset name'
              defaultValue={presetTitle}
              onSubmit={(presetName) =>
                handleExport({
                  presetName,
                  blockState: getBlocks(),
                  blockAttributes: getBlockAttributes(),
                })
              }
            />
            <Button
              className='import-button'
              title='Import'
              onClick={() => fileInputRef.current?.click()}
            >
              <Download /> Import
            </Button>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept='.json'
              onChange={(event) =>
                handleFileImport(
                  event,
                  setBlocks,
                  setBlockAttributes,
                  addToHistory,
                  config
                )
              }
            />
          </>
        )}

        {(presetMode === PresetMode.RemoteOnly ||
          presetMode === PresetMode.Default) && (
          <>
            <InputPopover
              icon={<CloudUpload />}
              triggerText='Save'
              placeholder='Enter preset name'
              onSubmit={handleSavePreset}
              defaultValue={presetTitle}
            />
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button className='load-button'>
                  <CloudDownload /> Load
                </Button>
              </PopoverTrigger>
              <PopoverContent
                showClose={false}
                className='PopoverContent'
                style={{
                  gap: '0.5rem',
                  overflow: 'auto',
                  padding: '0.5rem',
                  paddingLeft: 0,
                }}
              >
                {presetsQuery.isLoading ? (
                  <p>Loading presets...</p>
                ) : presetsQuery.isError ? (
                  <p>Error loading presets</p>
                ) : presetsQuery.data && presetsQuery.data.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h3 style={{ margin: 0 }}>Select Preset</h3>
                    <ScrollArea style={{ padding: '1rem', width: '100%' }}>
                      {presetsQuery.data.map((presetName) => (
                        <div
                          key={presetName}
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            alignItems: 'start',
                          }}
                        >
                          <ConfirmButton
                            style={{
                              flex: 1,
                              width: '100%',
                              font: '2cqw',
                              marginBottom: '0.15rem',
                              maxWidth: '10rem',
                              overflow: 'hidden',
                            }}
                            initialText={presetName}
                            confirmIcon={<></>}
                            confirmVariant='primary'
                            confirmText='Confirm reset editor'
                            variant='outline'
                            onConfirm={() => handlePresetSelect(presetName)}
                          />
                          <ConfirmButton
                            style={{
                              font: '2cqw',
                              marginBottom: '0.5rem',
                            }}
                            initialText=''
                            confirmText=''
                            initialIcon={
                              <Trash
                                style={{ width: '1rem', height: '1rem' }}
                              />
                            }
                            confirmIcon={
                              <Trash2
                                style={{ width: '1rem', height: '1rem' }}
                              />
                            }
                            confirmVariant='destructive'
                            variant='outline'
                            onConfirm={() => handleDeletePreset(presetName)}
                          />
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                ) : (
                  <p
                    style={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    No presets available <PackageOpen />{' '}
                  </p>
                )}
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
};

export default PresetManager;
