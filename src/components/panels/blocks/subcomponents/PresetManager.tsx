import React, { useRef } from 'react';
import { Button } from '../../../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/popover';
import { usePresetManager } from '../hooks/presets';
import { BlockState } from '..';
import { jsonToBlocks } from './utils/blockInstancer';
import InputPopover from '../../../ui/InputPopover';
import { ScrollArea } from '../../../ui/scrollArea';
import { ConfirmButton } from '../../../ui/ConfirmButton';
import {
  CloudDownload,
  CloudUpload,
  Download,
  PackageOpen,
  Trash,
  Trash2,
  Upload,
} from 'lucide-react';
import { handleExport, handleImport } from './utils/importExport';

interface PresetManagerProps {
  getBlocks: () => string;
  setBlocks: (blocks: BlockState[]) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  getBlocks,
  setBlocks,
}) => {
  const { presetsQuery, usePreset, savePreset, deletePreset } =
    usePresetManager();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedPresetName, setSelectedPresetName] = React.useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = usePreset(selectedPresetName || '');

  React.useEffect(() => {
    if (selectedPreset.data && selectedPreset.data.data) {
      const blocks = jsonToBlocks(selectedPreset.data.data);
      if (blocks) setBlocks(blocks);
    }
  }, [selectedPreset.data, setBlocks]);

  const handleSavePreset = (presetName: string) => {
    const jsonString = getBlocks();
    savePreset.mutate({ presetName, data: jsonString });
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
        <InputPopover
          triggerText='Export'
          icon={<Upload />}
          placeholder='Enter preset name'
          onSubmit={(presetName) => handleExport(presetName, getBlocks())}
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
          onChange={(event) => handleImport(event, setBlocks)}
        />
        <InputPopover
          icon={<CloudUpload />}
          triggerText='Save'
          placeholder='Enter preset name'
          onSubmit={handleSavePreset}
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
                          <Trash style={{ width: '1rem', height: '1rem' }} />
                        }
                        confirmIcon={
                          <Trash2 style={{ width: '1rem', height: '1rem' }} />
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
      </div>
    </div>
  );
};

export default PresetManager;
