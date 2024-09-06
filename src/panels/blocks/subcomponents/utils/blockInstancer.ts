import { BlockState } from '../..';
import { BaseBlock, ConcreteBlockClass } from '@/blocks/setup/Base';
import { BlockInterface, BlockMetadata } from '@/blocks/setup/Types';
import { templatify } from '@/blocks/utils/templater';
import { Preset } from '../PresetManager';

export const jsonToBlocks = (jsonString: string) => {
  try {
    const preset = JSON.parse(jsonString) as Preset;
    const blocks = JSON.parse(preset.blockState) as BlockState[];
    return parsedStatesToInstancedBlocks(blocks);
  } catch (E1) {
    try {
      const blocks = JSON.parse(jsonString) as BlockState[];
      return parsedStatesToInstancedBlocks(blocks);
    } catch (E2) {
      alert('Invalid Preset');
      console.error('Error parsing JSON:', E1, E2);
      return null;
    }
  }
};

const parsedStatesToInstancedBlocks = (blocks: BlockState[]): BlockState[] => {
  return blocks.map((block) => {
    return {
      ...block,
      instance: incompleteBlockToInstance(block),
    };
  });
};

const incompleteBlockToInstance = (block: BlockState): BlockInterface => {
  const completeBlock = class DynamicBlock extends BaseBlock {
    constructor() {
      super({
        schema: block.instance.schema,
        uiSchema: block.instance.uiSchema,
        defaultValues: block.instance.formData,
        meta: block.instance.meta,
        defaultHtml: block.instance.defaultHtml,
      });
    }
    static override getMeta(): BlockMetadata {
      return block.instance.meta;
    }

    generateHTML(id?: string): string {
      return templatify(block.instance.defaultHtml, this.formData, id);
    }
  } as ConcreteBlockClass;
  return new completeBlock();
};
