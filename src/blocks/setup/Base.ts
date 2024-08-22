import { customizeValidator } from "@rjsf/validator-ajv8";
import { BlockType, BlockDataMap, BlockMetadata } from "./Types";
import { BlockInterface } from "./Types";

export interface BlockConfig<T extends BlockType> {
  schema: object;
  uiSchema: object;
  defaultValues: BlockDataMap[T];
  meta: BlockMetadata;
}

export abstract class BaseBlock<T extends BlockType>
  implements BlockInterface<T>
{
  type: T;
  schema: object;
  uiSchema: object;
  formData: BlockDataMap[T];
  meta: BlockMetadata;

  constructor(type: T, config: BlockConfig<T>) {
    this.type = type;
    this.schema = config.schema;
    this.uiSchema = config.uiSchema;
    this.formData = { ...config.defaultValues };
    this.meta = config.meta;
  }

  static getMeta(): BlockMetadata {
    // Doing it this way so extending classes can override this method (static methods cannot be abstract in js sadly)
    return {
      label: "NOT_OVERRIDEN",
      thumbnailUrl: "NOT_OVERRIDEN",
      description: "NOT_OVERRIDEN",
      tags: ["NOT_OVERRIDEN"],
      group: "NOT_OVERRIDEN",
    };
  }

  abstract generateHTML(): string;

  validateData(): boolean {
    const validator = customizeValidator<BlockDataMap[T]>();
    return validator.isValid(this.schema, this.formData, this.schema);
    // return true;
  }

  updateFormData(newData: Partial<BlockDataMap[T]>): void {
    this.formData = { ...this.formData, ...newData };
  }
}

// export const formData: FormData = {};

// export const validator = customizeValidator<FormData>();
