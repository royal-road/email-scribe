import { BlockAttribute, BlockState } from '@/panels/blocks';
import { Preset } from '@/panels/blocks/managers/PresetManager';
import { jsonToBlocks } from '@/panels/blocks/utils/blockInstancer';

export const handleExport = (preset: Preset) => {
  const blob = new Blob([JSON.stringify(preset)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${preset.presetName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const processPresetData = (
  preset: Preset,
  setBlocks: (blocks: BlockState[]) => void,
  setOpenStates: (openStates: Record<string, BlockAttribute>) => void,
  addToHistory: (entry: BlockState[]) => void
) => {
  const blockState = jsonToBlocks(JSON.stringify(preset));
  const blockAttributes = JSON.parse(
    preset.blockAttributes
  ) as BlockAttribute[];

  if (blockState) {
    blockState.forEach((block) => {
      block.cachedHtml = block.instance.generateHTML(block.instance.id);
    });

    setBlocks(blockState);

    const ids = blockState.map((block) => block.instance.id);
    const openStates: Record<string, BlockAttribute> = {};
    ids.forEach((id, index) => {
      openStates[id] = blockAttributes[index];
    });

    setOpenStates(openStates);
    addToHistory(blockState);
  }
};

// Function to handle file import
export const handleFileImport = (
  event: React.ChangeEvent<HTMLInputElement>,
  setBlocks: (blocks: BlockState[]) => void,
  setOpenStates: (openStates: Record<string, BlockAttribute>) => void,
  addToHistory: (entry: BlockState[]) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const preset = JSON.parse(content) as Preset;
      processPresetData(preset, setBlocks, setOpenStates, addToHistory);
    };
    reader.readAsText(file);
    event.target.value = '';
  }
};

// Function to handle JSON import
export const handleJsonImport = (
  jsonData: string,
  setBlocks: (blocks: BlockState[]) => void,
  setOpenStates: (openStates: Record<string, BlockAttribute>) => void,
  addToHistory: (entry: BlockState[]) => void
) => {
  try {
    const preset = JSON.parse(jsonData) as Preset;
    processPresetData(preset, setBlocks, setOpenStates, addToHistory);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // Handle error (e.g., show error message to user)
  }
};

export const handleExportHtml = (html: string) => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
