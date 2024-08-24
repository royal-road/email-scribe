import { customizeValidator } from "@rjsf/validator-ajv8";
import { BlockMetadata } from "./Types";
import { BlockInterface } from "./Types";
import { RJSFSchema, UiSchema } from "@rjsf/utils";

export interface BlockConfig {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  defaultValues: Record<string, unknown>;
  meta: BlockMetadata;
}

export type ConcreteBlockClass = {
  new (): BaseBlock;
  getMeta(): BlockMetadata;
};

export abstract class BaseBlock implements BlockInterface {
  id: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: Record<string, unknown>;
  meta: BlockMetadata;

  constructor(config: BlockConfig) {
    this.schema = config.schema;
    this.uiSchema = config.uiSchema;
    this.formData = { ...config.defaultValues };
    this.meta = config.meta;
    this.id = Math.random().toString(36).substr(2, 9);
    console.log(this.meta.label, this);
  }

  static getMeta(): BlockMetadata {
    // Doing it this way so extending classes can override this method (static methods cannot be abstract in js sadly)
    return {
      id: "NOT_OVERRIDEN",
      label: "NOT_OVERRIDEN",
      thumbnailUrl: "NOT_OVERRIDEN",
      description: "NOT_OVERRIDEN",
      tags: ["NOT_OVERRIDEN"],
      group: "NOT_OVERRIDEN",
    };
  }

  abstract generateHTML(): string;

  validateData(): boolean {
    const validator = customizeValidator();
    return validator.isValid(this.schema, this.formData, this.schema);
    // return true;
  }

  updateFormData(newData: object): void {
    this.formData = { ...this.formData, ...newData };
  }
}

// export const formData: FormData = {};

// export const validator = customizeValidator<FormData>();
