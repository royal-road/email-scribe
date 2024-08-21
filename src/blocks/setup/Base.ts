import { customizeValidator } from "@rjsf/validator-ajv8";
import { BlockType, BlockDataMap } from "./Types";
import { BlockInterface } from "./Types";

export interface BlockConfig<T extends BlockType> {
  schema: object;
  uiSchema: object;
  defaultValues: BlockDataMap[T];
}

export abstract class BaseBlock<T extends BlockType>
  implements BlockInterface<T>
{
  type: T;
  schema: object;
  uiSchema: object;
  formData: BlockDataMap[T];

  constructor(type: T, config: BlockConfig<T>) {
    this.type = type;
    this.schema = config.schema;
    this.uiSchema = config.uiSchema;
    this.formData = { ...config.defaultValues };
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
