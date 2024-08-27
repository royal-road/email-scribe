import React, { useState, useRef } from 'react';
import { Button } from '../../../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/popover';
import { Preset, usePresetManager } from '../hooks/presets';
import { BlockState } from '..';

interface PresetManagerProps {
  getBlocks: () => string;
  setBlocks: (blocks: BlockState[]) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  getBlocks,
  setBlocks,
}) => {
  const { presetsQuery, usePreset, savePreset } = usePresetManager();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the usePreset hook at the top level
  const selectedPreset = usePreset(selectedPresetName || '');

  // Effect to apply the selected preset when it's loaded
  React.useEffect(() => {
    if (selectedPreset.data && selectedPreset.data.data) {
      const blocks = jsonToBlocks(selectedPreset.data.data);
      if (blocks) setBlocks(blocks);
    }
  }, [selectedPreset.data, setBlocks]);

  const handleExport = () => {
    const jsonString = getBlocks();
    const presetName = prompt('Enter a name for the preset:');
    if (presetName) {
      const preset = { presetName, data: jsonString } as Preset;
      const blob = new Blob([JSON.stringify(preset)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presetName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const blocks = jsonToBlocks(content);
        if (blocks) setBlocks(blocks);
      };
      reader.readAsText(file);
    }
  };

  const jsonToBlocks = (jsonString: string) => {
    try {
      const preset = JSON.parse(jsonString) as Preset;
      const blocks = JSON.parse(preset.data) as BlockState[];
      return blocks;
    } catch (E1) {
      try {
        const blocks = JSON.parse(jsonString) as BlockState[];
        return blocks;
      } catch (E2) {
        alert('Invalid Preset');
        console.error('Error parsing JSON:', E1, E2);
        return null;
      }
    }
  };

  const handleSavePreset = () => {
    const presetName = prompt('Enter a name for the preset:');
    if (presetName) {
      const jsonString = getBlocks();
      savePreset.mutate({ presetName, data: jsonString });
    }
  };

  const handlePresetSelect = (presetName: string) => {
    setSelectedPresetName(presetName);
    setIsPopoverOpen(false);
  };

  return (
    <div className='PresetManager'>
      <Button onClick={handleExport}>Export</Button>
      <Button onClick={() => fileInputRef.current?.click()}>Import</Button>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept='.json'
        onChange={handleImport}
      />
      <Button onClick={handleSavePreset}>Save Preset</Button>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button>Presets</Button>
        </PopoverTrigger>
        <PopoverContent className='PopoverContent'>
          {presetsQuery.isLoading ? (
            <p>Loading presets...</p>
          ) : presetsQuery.isError ? (
            <p>Error loading presets</p>
          ) : presetsQuery.data && presetsQuery.data.length > 0 ? (
            <ul className='preset-list'>
              {presetsQuery.data.map((presetName) => (
                <li key={presetName}>
                  <Button
                    variant='ghost'
                    onClick={() => handlePresetSelect(presetName)}
                  >
                    {presetName}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No presets available</p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PresetManager;
