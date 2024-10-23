import { BlockState } from '..';
// import { BaseBlock, ConcreteBlockClass } from '@/parser/setup/Base';
import { BlockInterface, BlockMetadata } from '@/parser/setup/Types';
// import { templatify } from '@/parser/utils/templater';
import { Preset } from '../managers/PresetManager';
import { parseTemplate } from '@/parser';
import { EmailScribeConfigProps } from '@/EmailScribe';
import { BaseBlock, ConcreteBlockClass } from '@/parser/setup/Base';
import { templatify } from '@/parser/utils/templater';

export const jsonToBlocks = (
  jsonString: string,
  config: EmailScribeConfigProps
) => {
  try {
    const preset = JSON.parse(jsonString) as Preset;
    const blocks = JSON.parse(preset.blockState) as BlockState[];
    return parsedStatesToInstancedBlocks(blocks, config);
  } catch (E1) {
    try {
      const blocks = JSON.parse(jsonString) as BlockState[];
      return parsedStatesToInstancedBlocks(blocks, config);
    } catch (E2) {
      alert('Invalid Preset');
      console.error('Error parsing JSON:', E1, E2);
      return null;
    }
  }
};

const parsedStatesToInstancedBlocks = (
  blocks: BlockState[],
  config: EmailScribeConfigProps
): BlockState[] => {
  return blocks.map((block, index) => {
    const instancedBlock =
      index === 0
        ? scaffoldBlockToInstance(block)
        : incompleteBlockToInstance(block, config);
    return {
      instance: instancedBlock,
      cachedHtml: instancedBlock.generateHTML(instancedBlock.id),
      data: instancedBlock.formData,
    };
  });
};

const incompleteBlockToInstance = (
  block: BlockState,
  config: EmailScribeConfigProps
): BlockInterface => {
  const BlockClass = parseTemplate(
    block.instance.defaultHtml,
    block.instance.meta.templateName || 'Dynamic',
    config
  );
  const instance = new BlockClass();
  instance.formData = block.data;
  console.log('Created instance:', instance);

  return instance;
};

const scaffoldBlockToInstance = (block: BlockState): BlockInterface => {
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
