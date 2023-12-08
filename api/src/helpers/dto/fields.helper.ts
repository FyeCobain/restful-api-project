import { capitalize } from '@helpers/strings'

// Returns an array with 'blank fields' error messages for each dto value that is a blank string
export function getBlankFieldsErrorMessages(dto: object): string[] {
  const errorMessages: string[] = new Array<string>()
  Object.entries(dto).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '')
      errorMessages.push(`${capitalize(key)} must not be blank`)
  })
  return errorMessages
}

export function propIsDefined(property: any): boolean {
  return typeof property !== 'undefined'
}

export function propIsUndefined(property: any): boolean {
  return typeof property === 'undefined'
}
