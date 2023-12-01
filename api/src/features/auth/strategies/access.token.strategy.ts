// Core / common imports
import { Injectable } from '@nestjs/common'

// JWT imports
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
  sub: string
  email: string
  role: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    return payload
  }
}
