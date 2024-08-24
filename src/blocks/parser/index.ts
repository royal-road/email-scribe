import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { BaseBlock, ConcreteBlockClass } from "../setup/Base";
import { BlockMetadata } from "../setup/Types";
import { templatify } from "../utils/templater";
import {
  getDefaultStyleValue,
  parseInlineStyle,
  propNameToTitle,
  setInlineStyle,
} from "./utils";

async function getModules(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`${error}`);
  }
}

function parseTemplate(content: string) {
  const parser = new DOMParser();
  try {
    const dom = parser.parseFromString(content, "text/html");
    const modules: ConcreteBlockClass[] = [];

    dom.body.querySelectorAll("[data-module]").forEach((node) => {
      modules.push(parseModule(node) as ConcreteBlockClass);
    });

    // modules.push(
    //   parseModule(
    //     dom.body.querySelectorAll("[data-module]")[0]
    //   ) as ConcreteBlockClass
    // );
    return modules;
  } catch (error) {
    throw new Error(`Error parsing file content: ${error}`);
  }
}

interface SchemaBundle {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  defaults: Record<string, unknown>;
}

function parseModule(node: Element): ConcreteBlockClass {
  const schemaBundle: SchemaBundle = {
    schema: { type: "object", properties: {}, required: [] },
    uiSchema: {},
    defaults: {},
  };
  try {
    handleBGColor(node, schemaBundle);
    handleBG(node, schemaBundle);
    handleSize(node, schemaBundle);
    handleColor(node, schemaBundle);
    handleBorderColor(node, schemaBundle);
    handleLinkSize(node, schemaBundle);
    handleLinkColor(node, schemaBundle);
    handleSingleLine(node, schemaBundle);
    handleMultiLine(node, schemaBundle);
    handleImages(node, schemaBundle);
  } catch (error) {
    console.error(error);
  }

  const moduleName = node.getAttribute("data-module");
  const meta: BlockMetadata = {
    label: propNameToTitle(moduleName || "Dynamic Block"),
    id:
      `${moduleName}${Math.random().toString(36).substring(7)}` ||
      Math.random().toString(36).substring(7),
    description: "",
    tags: [...(moduleName?.split("-") || [])],
    group: moduleName || "Dynamic Blocks",
    thumbnailUrl: `/thumbnails/${node.getAttribute("data-thumb")}`,
  };

  return class DynamicBlock extends BaseBlock {
    constructor() {
      super({
        schema: schemaBundle.schema,
        uiSchema: schemaBundle.uiSchema,
        defaultValues: schemaBundle.defaults,
        meta: meta,
      });
    }
    static override getMeta(): BlockMetadata {
      return meta;
    }

    generateHTML(): string {
      return templatify(node.outerHTML, this.formData);
    }
  } as ConcreteBlockClass;
}

function sanitizePropName(name: string, suffix: string): string {
  return `${name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}_${suffix}`;
}

function handleBGColor(node: Element, schemaBundle: SchemaBundle): void {
  const elements = node.querySelectorAll("[data-bgcolor]");
  elements.forEach((el) => {
    const propName = sanitizePropName(
      el.getAttribute("data-bgcolor") || "",
      "color"
    );
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget": "color",
        "ui:title": propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = el.getAttribute("bgcolor") || "";
    }
    el.setAttribute("bgcolor", `{{{${propName}}}}`);
  });
}

function handleBG(node: Element, schemaBundle: SchemaBundle): void {
  const elements = node.querySelectorAll("[data-bg]");
  elements.forEach((el) => {
    const propName = sanitizePropName(
      el.getAttribute("data-bg") || "",
      "image"
    );
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget": "file",
        "ui:classNames": "FileUploadWidget",
        "ui:title": propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = el.getAttribute("background") || "";
    }
    el.setAttribute("background", `{{{${propName}}}}`);
  });
}

function handleSize(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(node, schemaBundle, "data-size", "font-size", "size");
}

function handleColor(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(node, schemaBundle, "data-color", "color", "color");
}

function handleBorderColor(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(
    node,
    schemaBundle,
    "data-border-color",
    "border-color",
    "color"
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    "data-border-top-color",
    "border-top-color",
    "color"
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    "data-border-right-color",
    "border-right-color",
    "color"
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    "data-border-bottom-color",
    "border-bottom-color",
    "color"
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    "data-border-left-color",
    "border-left-color",
    "color"
  );
}

function handleStyleAttribute(
  node: Element,
  schemaBundle: SchemaBundle,
  dataAttr: string,
  styleAttr: string,
  suffix: string
): void {
  const elements = node.querySelectorAll(`[${dataAttr}]`);
  elements.forEach((el) => {
    const propName = sanitizePropName(el.getAttribute(dataAttr) || "", suffix);
    if (!schemaBundle.schema.properties[propName]) {
      const defaultStyleVal = getDefaultStyleValue(el, styleAttr);
      if (!defaultStyleVal) {
        return;
      }
      schemaBundle.defaults[propName] = defaultStyleVal;
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget": suffix === "color" ? "color" : "text",
        "ui:title": propNameToTitle(propName),
      };
    }
    const styleDict = parseInlineStyle(el);
    styleDict[styleAttr] = `{{{${propName}}}}`;
    setInlineStyle(el, styleDict);
  });
}

function handleLinkSize(node: Element, schemaBundle: SchemaBundle): void {
  handleLinkAttribute(
    node,
    schemaBundle,
    "data-link-size",
    "font-size",
    "link-size"
  );
}

function handleLinkColor(node: Element, schemaBundle: SchemaBundle): void {
  handleLinkAttribute(
    node,
    schemaBundle,
    "data-link-color",
    "color",
    "link-color"
  );
}

function handleLinkAttribute(
  node: Element,
  schemaBundle: SchemaBundle,
  dataAttr: string,
  styleAttr: string,
  suffix: string
): void {
  const elements = node.querySelectorAll(`[${dataAttr}]`);
  elements.forEach((el) => {
    const propName = sanitizePropName(el.getAttribute(dataAttr) || "", suffix);
    if (!schemaBundle.schema.properties[propName]) {
      const defaultStyleVal = getDefaultStyleValue(el, styleAttr);
      if (!defaultStyleVal || !el.querySelector("a")) {
        return;
      }
      schemaBundle.defaults[propName] = defaultStyleVal;
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget":
          suffix === "color" || suffix === "link-color" ? "color" : "text",
        "ui:title": propNameToTitle(
          suffix === "link-color"
            ? `${el.getAttribute(dataAttr)} color (anchor)`
            : propName
        ),
      };
    }
    el.querySelectorAll("a").forEach((link) => {
      const styleDict = parseInlineStyle(link);
      styleDict[styleAttr] = `{{{${propName}}}}`;
      setInlineStyle(link, styleDict);
    });
  });
}

function handleSingleLine(node: Element, schemaBundle: SchemaBundle): void {
  handleTextLine(node, schemaBundle, "singleline", "text");
}

function handleMultiLine(node: Element, schemaBundle: SchemaBundle): void {
  handleTextLine(node, schemaBundle, "multiline", "textarea");
}

function handleTextLine(
  node: Element,
  schemaBundle: SchemaBundle,
  tagName: string,
  widget: string
): void {
  const elements = node.getElementsByTagName(tagName);
  Array.from(elements).forEach((el) => {
    const propName = sanitizePropName(el.getAttribute("label") || "", "text");
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget": widget,
        "ui:title": propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = el.textContent || "";
    }
    el.textContent = `{{${propName}}}`;

    // Handle anchor tag if present
    handleAnchorTag(
      el,
      schemaBundle,
      sanitizePropName(el.getAttribute("label") || "", "link")
    );
  });
}

function handleImages(node: Element, schemaBundle: SchemaBundle): void {
  const images = node.getElementsByTagName("img");
  Array.from(images).forEach((img) => {
    const propName = sanitizePropName(
      img.getAttribute("mc:edit") || "",
      "image"
    );
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: "string" };
      schemaBundle.uiSchema[propName] = {
        "ui:widget": "file",
        "ui:classNames": "FileUploadWidget",
        "ui:options": {
          accept: "image/*",
          width: img.width || 640,
        },
        "ui:title": propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = img.getAttribute("src") || "";
    }
    img.setAttribute("src", `{{{${propName}}}}`);

    // Handle anchor tag if present
    handleAnchorTag(
      img,
      schemaBundle,
      sanitizePropName(img.getAttribute("mc:edit") || "", "link")
    );
  });
}

function handleAnchorTag(
  el: Element,
  schemaBundle: SchemaBundle,
  basePropName: string
): void {
  const parentAnchor = el.closest("a");
  if (parentAnchor) {
    if (!schemaBundle.schema.properties[basePropName]) {
      schemaBundle.schema.properties[basePropName] = {
        type: "string",
        format: "uri",
      };
      schemaBundle.uiSchema[basePropName] = {
        "ui:widget": "uri",
        "ui:title": propNameToTitle(basePropName),
      };
      schemaBundle.defaults[basePropName] =
        parentAnchor.getAttribute("href") || "";
    }
    parentAnchor.setAttribute("href", `{{{${basePropName}}}}`);
  }
}

export async function templateHandler() {
  return await processTemplate("http://localhost:8080/template");
}

async function processTemplate(url: string) {
  try {
    const templateContent = await getModules(url);
    return parseTemplate(templateContent);
  } catch (error) {
    console.error(error);
  }
}
