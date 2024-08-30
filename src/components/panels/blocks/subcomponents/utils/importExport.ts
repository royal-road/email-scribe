import { BlockAttribute, BlockState } from '../..';
import { Preset } from '../PresetManager';
import { jsonToBlocks } from './blockInstancer';

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

export const handleImport = (
  event: React.ChangeEvent<HTMLInputElement>,
  setBlocks: (blocks: BlockState[]) => void,
  setOpenStates: (openStates: Record<string, BlockAttribute>) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const preset = JSON.parse(content) as Preset;
      const blockState = jsonToBlocks(content);
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
        let index = 0;
        ids?.forEach((id) => {
          openStates[id] = blockAttributes[index];
          index++;
        });
        setOpenStates(openStates);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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
