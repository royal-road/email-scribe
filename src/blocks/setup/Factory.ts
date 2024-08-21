// src/blocks/factory/index.ts
import { BlockType } from "./Types";
import { BlockInterface } from "./Types";
import { ScaffoldingBlock } from "../Scaffolding";
// import { ImageBlock } from '../ImageBlock';
// import { ButtonBlock } from '../ButtonBlock';

export class BlockFactory {
  static createBlock<T extends BlockType>(type: T): BlockInterface<T> {
    switch (type) {
      case BlockType.Scaffolding:
        return new ScaffoldingBlock() as BlockInterface<T>;
      // case BlockType.Image:
      //   return new ImageBlock() as BlockInterface<T>;
      // case BlockType.Button:
      //   return new ButtonBlock() as BlockInterface<T>;
      default:
        throw new Error(`Unsupported block type: ${type}`);
    }
  }
}
