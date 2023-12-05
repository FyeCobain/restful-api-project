// Returns an attribute from the request user's payload
export const getPayloadValue = (req: any, attribute: string): string => {
  return req.user[attribute].trim().toLowerCase()
}

// Returns the user's sub (id)
export const getPayloadSub = (req: any): string => {
  return getPayloadValue(req, 'sub')
}

// Returns the email
export const getPayloadEmail = (req: any): string => {
  return getPayloadValue(req, 'email')
}
