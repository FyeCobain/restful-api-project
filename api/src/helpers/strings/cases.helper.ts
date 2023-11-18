// Returns the given string 'capitalized' (with the first letter in uppercase and the rest in lowercase)
export function capitalize(text: string): string {
  return text
    .substring(0, 1)
    .toUpperCase()
    .concat(text.substring(1).toLowerCase())
}
