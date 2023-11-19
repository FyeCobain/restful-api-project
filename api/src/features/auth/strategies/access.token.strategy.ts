// Core / common imports
import { Injectable } from '@nestjs/common'

// JWT imports
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// Payload type
type JwtPayload = {
  sub: string
  email: string
  role: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Constructor
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    })
  }

  // Validate method
  async validate(payload: JwtPayload) {
    return payload
  }
}
