import Handlebars from 'handlebars';
// import { inline } from "@css-inline/css-inline";

// This first inlines all the CSS in the HTML, then compiles the Handlebars template with the formdata input by the user
export function templatify(html: string, data: object, id?: string): string {
  // const inlined = inline(html);
  const template = Handlebars.compile(html);
  if (id) {
    return addEditorId(template(data), id);
  }
  return template(data);
}

const addEditorId = (html: string, id: string): string => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');

  const element = htmlDoc.querySelector('[data-module]');
  element?.setAttribute('editorid', id);

  return htmlDoc.documentElement.outerHTML;
};
