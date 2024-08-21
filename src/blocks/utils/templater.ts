import Handlebars from "handlebars";
// import { inline } from "@css-inline/css-inline";

// This first inlines all the CSS in the HTML, then compiles the Handlebars template with the formdata input by the user
export function templatify(html: string, data: object): string {
  // const inlined = inline(html);
  const template = Handlebars.compile(html);
  return template(data);
}
