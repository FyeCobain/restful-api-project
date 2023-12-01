export type JwtsObject = {
  accessToken: string
  refreshToken: string
}

export type JwtsObjectPromise = Promise<JwtsObject>
