const defaultClassesToRemove = [
  'editor-paragraph',
  'editor-text-underlineStrikethrough',
  'editor-text-bold',
  'editor-text-italic',
  'editor-text-underline',
  'editor-text-strikethrough',
  'editor-link',
];

export function sanitizeHtml(
  htmlString: string,
  classesToRemove: string[] = defaultClassesToRemove
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove all data attributes, mc: attributes, and specific classes
  doc.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      if (
        attr.name.startsWith('data-') ||
        attr.name.startsWith('mc:') ||
        ['editable', 'label', 'editorid', 'dir'].includes(attr.name)
      ) {
        element.removeAttribute(attr.name);
      } else if (attr.name === 'class') {
        const classes = attr.value.split(/\s+/);
        const filteredClasses = classes.filter(
          (cls) => !classesToRemove.includes(cls)
        );
        if (filteredClasses.length > 0) {
          element.setAttribute('class', filteredClasses.join(' '));
        } else {
          element.removeAttribute('class');
        }
      }
    });
  });

  // Convert <singleline> and <multiline> tags to their content
  ['singleline', 'multiline'].forEach((tag) => {
    doc.querySelectorAll(tag).forEach((element) => {
      const parent = element.parentNode;
      if (parent) {
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    });
  });

  // Get the sanitized HTML preserving the entire document structure
  const serializer = new XMLSerializer();
  return serializer
    .serializeToString(doc)
    .replace(/<\/?parsererror>/g, '') // Remove any parser error tags
    .trim();
}
