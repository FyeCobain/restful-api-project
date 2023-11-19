import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'

import { Strategy, ExtractJwt } from 'passport-jwt'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // Constructor
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    })
  }

  // Validate method
  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    return { ...payload, refreshToken }
  }
}
