import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { ScaffoldingBlockData } from "../Scaffolding";
import { BaseBlock } from "./Base";
import { HeaderBlockData } from "../Header";

export enum BlockType {
  Scaffolding = "scaffolding",
  Header = "header",
  // Banner = "banner",
  // Add other block types as needed
}

export interface ButtonBlockData {
  text: string;
  url: string;
}

export type BlockDataMap = {
  [BlockType.Scaffolding]: ScaffoldingBlockData;
  [BlockType.Header]: HeaderBlockData;
  // [BlockType.Banner]: ButtonBlockData;
  // Add other mappings as needed
};

export type BlockClassMap = {
  [K in BlockType]: typeof BaseBlock & {
    new (): BlockInterface<K>;
  };
};

export interface BlockMetadata {
  label: string;
  thumbnailUrl: string;
  description: string;
  tags: string[]; // In case we want to add tag based filtering
  group: string; // To group blocks in the UI
}

export interface BlockInterface<T extends BlockType> {
  id: string;
  type: T;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: BlockDataMap[T];
  meta: BlockMetadata;

  generateHTML(): string;
  validateData(): boolean;
  updateFormData(newData: Partial<BlockDataMap[T]>): void;
}
