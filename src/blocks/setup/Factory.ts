// src/blocks/factory/index.ts
import { BlockClassMap, BlockType } from "./Types";
import { BlockInterface } from "./Types";
import { ScaffoldingBlock } from "../Scaffolding";
import { HeaderBlock } from "../Header";
// import { ImageBlock } from '../ImageBlock';
// import { ButtonBlock } from '../ButtonBlock';

export class BlockFactory {
  static createBlock<T extends BlockType>(type: T): BlockInterface<T> {
    switch (type) {
      case BlockType.Scaffolding:
        return new ScaffoldingBlock() as BlockInterface<T>;
      case BlockType.Header:
        return new HeaderBlock() as BlockInterface<T>;
      // case BlockType.Button:
      //   return new ButtonBlock() as BlockInterface<T>;
      default:
        throw new Error(`Unsupported block type: ${type}`);
    }
  }

  static getClassForBlockType<T extends BlockType>(type: T): BlockClassMap[T] {
    switch (type) {
      case BlockType.Scaffolding:
        return ScaffoldingBlock as unknown as BlockClassMap[T];
      case BlockType.Header:
        return HeaderBlock as unknown as BlockClassMap[T];
      // case BlockType.Banner:
      //   return ButtonBlock as BlockClassMap[T];
      default:
        throw new Error(`Unsupported block type: ${type}`);
    }
  }
}
