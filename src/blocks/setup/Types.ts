import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { ScaffoldingBlockData } from "../Scaffolding";

export enum BlockType {
  Scaffolding = "scaffolding",
  Header = "header",
  Banner = "banner",
  // Add other block types as needed
}

export interface ImageBlockData {
  src: string;
  alt: string;
  width: number;
}

export interface ButtonBlockData {
  text: string;
  url: string;
}

export type BlockDataMap = {
  [BlockType.Scaffolding]: ScaffoldingBlockData;
  [BlockType.Header]: ImageBlockData;
  [BlockType.Banner]: ButtonBlockData;
  // Add other mappings as needed
};

export interface BlockInterface<T extends BlockType> {
  type: T;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: BlockDataMap[T];

  generateHTML(): string;
  validateData(): boolean;
  updateFormData(newData: Partial<BlockDataMap[T]>): void;
}
