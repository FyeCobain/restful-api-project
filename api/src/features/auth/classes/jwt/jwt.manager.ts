import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtManager {
  constructor(private jwtService: JwtService) {}

  // Returns the token's payload if it is valid, null otherwise
  async getPayload(jwt: string, secret: string, ignoreExpiration = false) {
    let payload: any = null
    try {
      payload = await this.jwtService.verifyAsync(jwt, {
        secret,
        ignoreExpiration,
      })
    } catch (error) {}
    return payload
  }

  // Returns true if the token has expired but is valid
  async isExpired(jwt: string, secret: string): Promise<boolean> {
    return (
      (await this.getPayload(jwt, secret)) === null &&
      (await this.getPayload(jwt, secret, true)) !== null
    )
  }
}
