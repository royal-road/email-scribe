// import Handlebars from 'handlebars';

export function templatify(html: string, data: object, id?: string): string {
  if (id) {
    return addEditorId(handleBars(html, data), id);
  }
  return handleBars(html, data);
}

// export function templatifyMustaches(html: string, data: object): string {
//   const template = Handlebars.compile(html);
//   return template(data);
// }

const addEditorId = (html: string, id: string): string => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');

  const element = htmlDoc.querySelector('[data-module]');
  element?.setAttribute('editorid', id);

  return htmlDoc.documentElement.outerHTML;
};

// This function will only handle flat data objects. Nested objects WILL fail.
// Empty keys are cleaned (so no handlebars are left in the final HTML).
// Keys not found in data obj are cleaned too.
export function handleBars(template: string, data: object): string {
  // \{\{ Mathces opening double braces
  // (\{?) Optionally matches the opening triple brace
  // (.+?) Matches and captures one or more characters, non greedy
  // (\}?)Optionally matches and captures a third closing braces
  // \}\} matches closing double braces
  // g flag makes it match this globally

  return template.replace(/\{{2,3}(.+?)\}{2,3}/g, (match, key) => {
    const trimmedKey = key.trim();
    if (trimmedKey === '' || !(trimmedKey in data)) {
      return ''; // Replace with empty string if key is empty or not in data
    }

    const value = data[trimmedKey as keyof typeof data];

    // Check for undefined or null, return empty string if so
    if (value === undefined || value === null) {
      return '';
    }

    const isTriple = match.startsWith('{{{') && match.endsWith('}}}');
    return isTriple ? String(value) : escapeHtml(String(value));
  });
}

function escapeHtml(str: string): string {
  const entityMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return str.replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}
