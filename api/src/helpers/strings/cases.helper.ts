// Turns the first text letter in uppercase and the rest in lowercase
export function capitalize(text: string): string {
  return text
    .substring(0, 1)
    .toUpperCase()
    .concat(text.substring(1).toLowerCase())
}

// Turns the first letter of each word in uppercase and the rest in lowercase
export function titleize(text: string): string {
  return text
    .split(' ')
    .map((word: string) => capitalize(word))
    .join(' ')
}
