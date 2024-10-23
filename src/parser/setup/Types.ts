import type { RJSFSchema, UiSchema } from '@rjsf/utils';
// import { BaseBlock } from "./Base";

// export enum BlockType {
//   Scaffolding = "scaffolding",
//   Header = "header",
//   // Banner = "banner",
//   // Add other block types as needed
// }

// export interface ButtonBlockData {
//   text: string;
//   url: string;
// }

// export type BlockDataMap = {
//   [BlockType.Scaffolding]: ScaffoldingBlockData;
//   [BlockType.Header]: HeaderBlockData;
//   // [BlockType.Banner]: ButtonBlockData;
//   // Add other mappings as needed
// };

// export type BlockClassMap = {
//   [K in BlockType]: typeof BaseBlock & {
//     new (): BlockInterface<K>;
//   };
// };

export interface BlockMetadata {
  label: string;
  thumbnailUrl: string;
  description?: string;
  id: string;
  tags: string[]; // In case we want to add tag based filtering
  group: string; // To group blocks in the UI
  templateName?: string;
}

export interface BlockInterface {
  id: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: Record<string, unknown>;
  meta: BlockMetadata;
  defaultHtml: string;

  generateHTML(id?: string): string;
  validateData(): boolean;
  updateFormData(newData: Record<string, unknown>): void;
}
