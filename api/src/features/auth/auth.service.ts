// Core / common imports
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

// Interface imports
import { AuthServiceInterface } from './interfaces/auth.service.interface'

// JWT / Hashing imports
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtManager } from './classes/jwt'
import * as argon2 from 'argon2'

// Services imports
import { UsersService } from '@features/users/users.service'

// Types / DTOs imports
import { JwtsObjectPromise } from './types'
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'

// Mailer
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtManager: JwtManager,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async hashData(data: string) {
    return await argon2.hash(data)
  }

  async signUp(createUserDto: CreateUserDto): JwtsObjectPromise {
    if (await this.usersService.findByEmail(createUserDto.email))
      throw new BadRequestException('User already exists!')

    const createdUser = await this.usersService.create(createUserDto)

    const tokens = await this.getTokens(
      createdUser.id,
      createdUser.email,
      createdUser.accountType,
    )

    await this.updateRefreshToken(createdUser.id, tokens.refreshToken)

    return tokens
  }

  async signIn(authDto: AuthDto): JwtsObjectPromise {
    // Checking if user exists and if the password is correct
    const user = await this.usersService.findByEmail(authDto.email)
    if (!user) throw new BadRequestException('User does not exist')
    if (!(await argon2.verify(user.password, authDto.password)))
      throw new UnauthorizedException('Password is incorrect')
    // Getting new tokens and updating the refresh token in the DB
    const tokens = await this.getTokens(user.id, user.email, user.accountType)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async logOut(userId: string) {
    const user = await this.usersService.findOne(userId)
    if (!user) throw new ForbiddenException()
    return await this.usersService.update(userId, { refreshToken: null })
  }

  // Creates an returns the user's tokens
  async getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): JwtsObjectPromise {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: accountType,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: accountType,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: await this.hashData(refreshToken),
    })
  }

  // Performs the tokens refreshing
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException()
    // Checking if the request's refresh token is the same as the DB hashed one
    const refreshTokensMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    )
    if (!refreshTokensMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user.id, user.email, user.accountType)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  // Creates a token for password reset and sends it to the email address
  async createResetPassToken(emailAddress: string): Promise<string> {
    const user = await this.usersService.findByEmail(emailAddress)
    if (!user) throw new BadRequestException('User not found')

    const jwt = await this.jwtService.signAsync(
      {
        sub: emailAddress,
      },
      {
        secret: this.configService.get<string>('secrets.jwtResetPass'),
        expiresIn: '2h',
      },
    )

    // Sendin an e-mail to the user's email address
    try {
      await this.sendEmail(
        emailAddress,
        "Reset your Nest.js project's password",
        'reset-pass-token',
        {
          userName: user.name,
          jwt,
        },
      )
    } catch (error) {
      throw new InternalServerErrorException({
        error:
          'Sorry, we were unable to send the email with the password reset link',
        reset_pass_jwt: jwt,
      })
    }

    return jwt
  }

  async resetPassword(jwt: string, newPassword: string) {
    const payload = await this.jwtManager.getPayload(
      jwt,
      this.configService.get<string>('secrets.jwtResetPass'),
    )
    if (!payload) throw new UnauthorizedException()

    const user = await this.usersService.findByEmail(payload.sub)
    if (!user) throw new BadRequestException('User not found')

    await this.usersService.update(user.id, { password: newPassword })
  }

  // Emailing
  async sendEmail(
    to: string,
    subject: string,
    template: string,
    emailPayload: object,
    appName = 'Nest.js project',
    from = 'michel.bracam@example.com',
  ) {
    await this.mailerService.sendMail({
      to,
      from,
      subject,
      template,
      context: {
        appName,
        emailPayload,
        year: new Date().getFullYear(),
      },
    })
  }
}
