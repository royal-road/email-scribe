import { BlockState } from '../..';
import { Preset } from '../../hooks/presets';
import { jsonToBlocks } from './blockInstancer';

export const handleExport = (presetName: string, jsonString: string) => {
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
};

export const handleImport = (
  event: React.ChangeEvent<HTMLInputElement>,
  setBlocks: (blocks: BlockState[]) => void,
  setOpenStates: (
    openStates: Record<string, { isOpen: boolean; isSelected: boolean }>
  ) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const blocks = jsonToBlocks(content);
      if (blocks) {
        blocks.forEach((block) => {
          block.cachedHtml = block.instance.generateHTML(block.instance.id);
        });
        setBlocks(blocks);
        const ids = blocks.map((block) => block.instance.id);
        const openStates: Record<
          string,
          { isOpen: boolean; isSelected: boolean }
        > = {};
        ids?.forEach((id) => {
          openStates[id] = { isOpen: false, isSelected: false };
        });
        setOpenStates(openStates);
      }
    };
    reader.readAsText(file);
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
