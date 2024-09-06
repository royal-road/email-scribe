export function makeFullyQualifiedUrl(input: string): string {
  // Regular expression to match URLs
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;

  // Check if the input is already a fully qualified URL
  if (urlRegex.test(input)) {
    // If it doesn't start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(input)) {
      return `https://${input}`;
    }
    return input;
  }

  // If it's not a URL, assume it's a domain and add https:// and .com
  if (!/\.\w{2,}$/.test(input)) {
    return `https://${input}.com`;
  }

  // If it has a domain but no protocol, add https://
  return `https://${input}`;
}
