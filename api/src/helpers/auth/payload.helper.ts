// Returns an attribute from the request user's payload
export const getPayloadValue = (
  req: any,
  attributeName: string,
  lowerCase = true,
): string => {
  return lowerCase
    ? req.user[attributeName].trim().toLowerCase()
    : req.user[attributeName].trim()
}

// Returns the user's sub (id)
export const getPayloadSub = (req: any): string => {
  return getPayloadValue(req, 'sub', false)
}

// Returns the email
export const getPayloadEmail = (req: any): string => {
  return getPayloadValue(req, 'email')
}
