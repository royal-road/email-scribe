import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { v4 as uuidv4 } from 'uuid';
import { BaseBlock, ConcreteBlockClass } from '@/parser/setup/Base';
import { BlockMetadata } from '@/parser/setup/Types';
import { templatify } from '@/parser/utils/templater';
import {
  getDefaultStyleValue,
  isRelativeUrl,
  moduleTagFinder,
  parseInlineStyle,
  propNameToTitle,
  setInlineStyle,
} from '@/parser/utils/parseHelpers';
import { camelToTitleCase } from '@lib/utils';
import { EmailScribeConfigProps } from '@/App';

export function parseTemplate(
  content: string,
  templateName: string,
  config: EmailScribeConfigProps
) {
  const parser = new DOMParser();
  try {
    const dom = parser.parseFromString(content, 'text/html');
    const modules: ConcreteBlockClass[] = [];

    dom.body.querySelectorAll('[data-module]').forEach((node) => {
      modules.push(
        parseModule(node, templateName, config) as ConcreteBlockClass
      );
    });

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

function parseModule(
  node: Element,
  templateName: string,
  config: EmailScribeConfigProps
): ConcreteBlockClass {
  const schemaBundle: SchemaBundle = {
    schema: { type: 'object', properties: {}, required: [] },
    uiSchema: {},
    defaults: {},
  };
  const templateUrlPrefix = `${config.apiUrl}/${config.basePath}/templates/${templateName}/`;
  const counters = {
    singleLine: 0,
    multiLine: 0,
    img: 0,
  };
  try {
    // This Order is IMPORTANT
    handleLinkSize(node, schemaBundle);
    handleBorderColor(node, schemaBundle);
    handleSize(node, schemaBundle);
    handleColor(node, schemaBundle);
    handleLinkColor(node, schemaBundle);
    handleSingleLine(node, schemaBundle, counters);
    handleMultiLine(node, schemaBundle, counters);
    handleImages(node, schemaBundle, counters, templateUrlPrefix);
    handleBGColor(node, schemaBundle);
    handleBG(node, schemaBundle, templateUrlPrefix);
  } catch (error) {
    console.error(error);
  }

  const moduleName = node.getAttribute('data-module');
  const meta: BlockMetadata = {
    label: propNameToTitle(moduleName || 'Dynamic Block'),
    id: `${moduleName}${uuidv4()}` || uuidv4(),
    description: '',
    tags: [propNameToTitle(templateName), ...moduleTagFinder(moduleName || '')],
    group: moduleName || 'Dynamic Blocks',
    thumbnailUrl: `${templateUrlPrefix}thumbnails/${node.getAttribute('data-thumb')}`,
  };

  return class DynamicBlock extends BaseBlock {
    constructor() {
      super({
        schema: schemaBundle.schema,
        uiSchema: schemaBundle.uiSchema,
        defaultValues: schemaBundle.defaults,
        meta: meta,
        defaultHtml: node.outerHTML,
      });
    }
    static override getMeta(): BlockMetadata {
      return meta;
    }

    generateHTML(id?: string): string {
      return templatify(node.outerHTML, this.formData, id);
    }
  } as ConcreteBlockClass;
}

function sanitizePropName(name: string, suffix: string): string {
  return `${name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}_${suffix}`;
}

function handleBGColor(node: Element, schemaBundle: SchemaBundle): void {
  const elements = node.querySelectorAll('[data-bgcolor]');
  elements.forEach((el) => {
    const propName = sanitizePropName(
      el.getAttribute('data-bgcolor') || '',
      'color'
    );
    el.setAttribute('editorid', propName);
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget': 'color',
        'ui:title': propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = el.getAttribute('bgcolor') || '';
    }
    el.setAttribute('bgcolor', `{{{${propName}}}}`);
  });
}

function handleBG(
  node: Element,
  schemaBundle: SchemaBundle,
  templateUrlPrefix: string
): void {
  const elements = node.querySelectorAll('[data-bg]');
  elements.forEach((el) => {
    const propName = sanitizePropName(
      el.getAttribute('data-bg') || '',
      'image'
    );
    el.setAttribute('editorid', propName);
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget': 'file',
        'ui:classNames': 'FileUploadWidget',
        'ui:title': propNameToTitle(propName),
      };
      schemaBundle.defaults[propName] = isRelativeUrl(
        el.getAttribute('background') || ''
      )
        ? `${templateUrlPrefix}${el.getAttribute('background')}`
        : el.getAttribute('background');
    }
    el.setAttribute('background', `{{{${propName}}}}`);
  });
}

function handleSize(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(node, schemaBundle, 'data-size', 'font-size', 'size');
}

function handleColor(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(node, schemaBundle, 'data-color', 'color', 'color');
}

function handleBorderColor(node: Element, schemaBundle: SchemaBundle): void {
  handleStyleAttribute(
    node,
    schemaBundle,
    'data-border-color',
    'border-color',
    'color'
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    'data-border-top-color',
    'border-top-color',
    'color'
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    'data-border-right-color',
    'border-right-color',
    'color'
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    'data-border-bottom-color',
    'border-bottom-color',
    'color'
  );
  handleStyleAttribute(
    node,
    schemaBundle,
    'data-border-left-color',
    'border-left-color',
    'color'
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
    const propName = sanitizePropName(el.getAttribute(dataAttr) || '', suffix);
    if (dataAttr !== 'data-border-color') {
      el.setAttribute('editorid', propName);
    }
    if (!schemaBundle.schema.properties[propName]) {
      const defaultStyleVal = getDefaultStyleValue(el, styleAttr);
      if (!defaultStyleVal) {
        return;
      }
      schemaBundle.defaults[propName] = defaultStyleVal;
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget': suffix === 'color' ? 'color' : 'text',
        'ui:title': propNameToTitle(propName),
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
    'data-link-size',
    'font-size',
    'link-size'
  );
}

function handleLinkColor(node: Element, schemaBundle: SchemaBundle): void {
  handleLinkAttribute(
    node,
    schemaBundle,
    'data-link-color',
    'color',
    'link-color'
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
    const propName = sanitizePropName(el.getAttribute(dataAttr) || '', suffix);
    if (!schemaBundle.schema.properties[propName]) {
      const defaultStyleVal = getDefaultStyleValue(el, styleAttr);
      if (!defaultStyleVal || !el.querySelector('a')) {
        return;
      }
      schemaBundle.defaults[propName] = defaultStyleVal;
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget':
          suffix === 'color' || suffix === 'link-color' ? 'color' : 'text',
        'ui:title': propNameToTitle(
          suffix === 'link-color'
            ? `${el.getAttribute(dataAttr)} color (anchor)`
            : propName
        ),
      };
    }
    el.querySelectorAll('a').forEach((link) => {
      const styleDict = parseInlineStyle(link);
      styleDict[styleAttr] = `{{{${propName}}}}`;
      setInlineStyle(link, styleDict);
    });
  });
}

function handleSingleLine(
  node: Element,
  schemaBundle: SchemaBundle,
  counters: { singleLine: number }
): void {
  handleTextLine(node, schemaBundle, 'singleline', 'text', counters);
}

function handleMultiLine(
  node: Element,
  schemaBundle: SchemaBundle,
  counters: { multiLine: number }
): void {
  handleTextLine(node, schemaBundle, 'multiline', 'textarea', counters);
}

function handleTextLine(
  node: Element,
  schemaBundle: SchemaBundle,
  tagName: string,
  widget: string,
  counters: { singleLine: number } | { multiLine: number }
): void {
  const elements = node.getElementsByTagName(tagName);
  Array.from(elements).forEach((el) => {
    let parentElement = el.parentElement;
    let mcEdit = null;

    // If the parent is an anchor, go one level higher
    if (parentElement && parentElement.tagName.toLowerCase() === 'a') {
      parentElement = parentElement.parentElement;
    }

    // Find the closest ancestor with mc:edit attribute
    while (parentElement && !mcEdit) {
      mcEdit = parentElement.getAttribute('mc:edit');
      if (!mcEdit) {
        parentElement = parentElement.parentElement;
      }
    }

    const counterType = tagName === 'singleline' ? 'singleLine' : 'multiLine';
    counters[counterType as keyof typeof counters]++;
    const propName = sanitizePropName(
      mcEdit ||
        `${counterType}_${counters[counterType as keyof typeof counters]}`,
      'text'
    );
    el.setAttribute('editorid', propName);

    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget': widget,
        'ui:title': `${camelToTitleCase(counterType)} ${
          counters[counterType as keyof typeof counters]
        }`,
      };
      schemaBundle.defaults[propName] = el.textContent || '';
    }
    // Multi-line text should be wrapped in triple curly braces to render the html received from Lexical
    if (tagName === 'singleline') {
      el.textContent = `{{${propName}}}`;
    } else {
      el.textContent = `{{{${propName}}}}`;
    }

    // Handle anchor tag if present
    handleAnchorTag(el, schemaBundle, propName);
  });
}

function handleImages(
  node: Element,
  schemaBundle: SchemaBundle,
  counters: { img: number },
  templateUrlPrefix: string
): void {
  const images = node.getElementsByTagName('img');
  Array.from(images).forEach((img) => {
    counters.img++;
    const propName = sanitizePropName(
      img.getAttribute('mc:edit') || '',
      'image'
    );
    if (!schemaBundle.schema.properties[propName]) {
      schemaBundle.schema.properties[propName] = { type: 'string' };
      schemaBundle.uiSchema[propName] = {
        'ui:widget': 'file',
        'ui:classNames': 'FileUploadWidget',
        'ui:options': {
          accept: 'image/*',
          width: img.width || 640,
        },
        'ui:title': `Image ${counters.img}`,
      };
      img.setAttribute('editorid', propName);
      schemaBundle.defaults[propName] = isRelativeUrl(
        img.getAttribute('src') || ''
      )
        ? `${templateUrlPrefix}${img.getAttribute('src')}`
        : img.getAttribute('src');
    }
    img.setAttribute('src', `{{{${propName}}}}`);

    // Handle anchor tag if present
    handleAnchorTag(img, schemaBundle, propName);
  });
}

function handleAnchorTag(
  el: Element,
  schemaBundle: SchemaBundle,
  basePropName: string
): void {
  const parentAnchor = el.closest('a');
  if (parentAnchor) {
    let mcEdit = null;
    let currentElement = parentAnchor.parentElement;

    // Find the closest ancestor with mc:edit attribute
    while (currentElement && !mcEdit) {
      mcEdit = currentElement.getAttribute('mc:edit');
      if (!mcEdit) {
        currentElement = currentElement.parentElement;
      }
    }

    const linkPropName = `${
      mcEdit ? sanitizePropName(mcEdit, 'link') : basePropName + '_link'
    }`;
    if (!schemaBundle.schema.properties[linkPropName]) {
      schemaBundle.schema.properties[linkPropName] = {
        type: 'string',
        format: 'uri',
      };
      schemaBundle.uiSchema[linkPropName] = {
        'ui:widget': 'uri',
        'ui:title': `${propNameToTitle(mcEdit || basePropName)} (Link)`,
      };
      // el.setAttribute('editorid', linkPropName);
      schemaBundle.defaults[linkPropName] =
        parentAnchor.getAttribute('href') || '';
    }
    parentAnchor.setAttribute('href', `{{{${linkPropName}}}}`);
  }
}
