export function getDefaultStyleValue(
  el: Element,
  styleAttr: string,
  attrToChange: string = 'style'
): string | undefined {
  const styleDict = parseInlineStyle(el, attrToChange);
  return styleDict[styleAttr] || undefined;
}

export function setInlineStyle(
  element: Element,
  styles: Record<string, string>,
  attrToChange: string = 'style'
): void {
  const styleString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
  element.setAttribute(attrToChange, styleString);
}

export function parseInlineStyle(
  element: Element,
  attrToChange: string = 'style'
): Record<string, string> {
  const styleAttr = element.getAttribute(attrToChange);
  if (!styleAttr) return {};

  const styleObject: Record<string, string> = {};
  const styles = styleAttr.split(';');

  styles.forEach((style) => {
    const [property, value] = style.split(':').map((part) => part.trim());
    if (property && value) {
      styleObject[property] = value;
    }
  });

  return styleObject;
}

export function propNameToTitle(propName: string): string {
  // Convert all to first lowercase, swap - or _ for space, then title case
  return propName
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export function isRelativeUrl(url: string): boolean {
  // Check if the URL starts with a protocol or double slashes
  if (/^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)) {
    return false;
  }

  // Check if the URL starts with a slash, hash, or question mark
  if (/^[/#?]/.test(url)) {
    return true;
  }

  // Check if the URL contains a colon followed by a number (for port)
  if (/:\d+/.test(url)) {
    return false;
  }

  // If none of the above conditions are met, it's likely a relative URL
  return true;
}

export function moduleTagFinder(moduleName: string): string[] {
  // Remove all number
  const md = moduleName.replace(/[0-9]/g, '');
  // Split by - or _ or space
  let tags = md.split(/[-_ ]/);
  // Remove empty string
  tags = tags.filter((tag) => tag !== '');
  return tags || [];
}
