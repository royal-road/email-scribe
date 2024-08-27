export function sanitizeHtml(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove all data attributes and mc: attributes
  doc.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      if (
        attr.name.startsWith('data-') ||
        attr.name.startsWith('mc:') ||
        ['editable', 'label'].includes(attr.name)
      ) {
        element.removeAttribute(attr.name);
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
    .replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '') // Remove default xmlns attribute
    .trim();
}
