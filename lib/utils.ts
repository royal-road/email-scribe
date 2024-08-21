export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function camelToTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
