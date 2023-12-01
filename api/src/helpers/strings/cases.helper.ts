export function capitalize(text: string): string {
  return text
    .substring(0, 1)
    .toUpperCase()
    .concat(text.substring(1).toLowerCase())
}
