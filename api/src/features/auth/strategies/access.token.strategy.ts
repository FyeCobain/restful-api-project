// Core / common imports
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

// JWT imports
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtManager } from '../classes/jwt'

type JwtPayload = {
  sub: string
  email: string
  role: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private jwtManager: JwtManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    // Checking if the token has expired
    const accessToken = req.get('Authorization').replace('Bearer', '').trim()
    const jwtExpired = await this.jwtManager.isExpired(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
    )
    if (jwtExpired) throw new UnauthorizedException('Token expired')

    return payload
  }
}
