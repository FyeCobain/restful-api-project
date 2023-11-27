// Common imports
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'

// Interface imports
import { AuthServiceInterface } from './interfaces/auth.service.interface'

// JWT / Hashing imports
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'

// Services imports
import { UsersService } from '@features/users/users.service'

// DTOs imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'

// Mailer
import { MailerService } from '@nestjs-modules/mailer'
import { JwtsObject } from './types/jwts.object.type'

@Injectable()
export class AuthService implements AuthServiceInterface {
  // Constructor
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  // Hashes the given string
  async hashData(data: string) {
    return await argon2.hash(data)
  }

  // Signs up a new user
  async signUp(createUserDto: CreateUserDto): Promise<JwtsObject> {
    // Checking if user already exists
    if (await this.usersService.findByEmail(createUserDto.email))
      throw new ConflictException('User already exists!')

    // Saving new user into the DB
    const createdUser = await this.usersService.create(createUserDto)

    // Getting new tokens
    const tokens = await this.getTokens(
      createdUser.id,
      createdUser.email,
      createdUser.accountType,
    )

    // Saving the refresh token in the DB
    await this.updateRefreshToken(createdUser.id, tokens.refreshToken)

    // Returning the new tokens
    return tokens
  }

  // Authenticates a user
  async signIn(authDto: AuthDto): Promise<JwtsObject> {
    // Checking if user exists and if the password is correct
    const user = await this.usersService.findByEmail(authDto.email)
    if (!user) throw new BadRequestException('User does not exist')
    if (!(await argon2.verify(user.password, authDto.password)))
      throw new BadRequestException('Password is incorrect')
    // Getting new tokens and updating the refresh token in the DB
    const tokens = await this.getTokens(user.id, user.email, user.accountType)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    // Returning the new tokens
    return tokens
  }

  // Performs the logout (deletes the refresh token)
  async logOut(userId: string) {
    // Checking if user exists
    const user = await this.usersService.findOne(userId)
    if (!user) throw new ForbiddenException()
    return await this.usersService.update(userId, { refreshToken: null })
  }

  // Creates an returns the user's tokens
  async getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): Promise<JwtsObject> {
    // Generating tokens
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

    // Returning generated tokens
    return {
      accessToken,
      refreshToken,
    }
  }

  // Hashes and updates the refresh token in the DB
  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: await this.hashData(refreshToken),
    })
  }

  // Performs the tokens refreshing
  async refreshTokens(userId: string, refreshToken: string) {
    // Searching for the user in the DB and checking if its refresh token is not null
    const user = await this.usersService.findOne(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException()
    // Checking if the request's refresh token is the same as the DB hashed one
    const refreshTokensMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    )
    if (!refreshTokensMatches) throw new ForbiddenException()
    // Refreshing tokens
    const tokens = await this.getTokens(user.id, user.email, user.accountType)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  // Creates a token for password reset and sends it to the email address
  async createResetPassToken(emailAddress: string): Promise<string> {
    // Getting user and checking if exists
    const user = await this.usersService.findByEmail(emailAddress)
    if (!user) throw new BadRequestException('User not found')

    // Creating password reset JWT
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
      await this.mailerService.sendMail({
        to: emailAddress,
        from: 'michel.bracam@example.com',
        subject: "Reset your Nest.js project's password",
        //text: `Please POST your new password to: http://localhost:4000/auth/resetpass?token=${jwt}`,
        template: 'reset-pass-token',
        context: {
          appName: 'Nest.js project',
          emailPayload: {
            userName: user.name,
            jwt,
          },
          year: new Date().getFullYear(),
        },
      })
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'We were unable to send the email with the password reset link',
        reset_pass_jwt: jwt,
      })
    }

    // Returning the jwt
    return jwt
  }

  // Resets the user's password
  async resetPassword(jwt: string, newPassword: string) {
    // Getting payload while validating JWT' signature
    const payload = await this.getTokenPayload(jwt)
    if (!payload) throw new UnauthorizedException()
    // Getting user
    const user = await this.usersService.findByEmail(payload.sub)
    if (!user) throw new BadRequestException('User not found')
    // Hashing and updating user's password
    await this.usersService.update(user.id, { password: newPassword })
  }

  // Validates the token and returns the paylaod
  async getTokenPayload(
    jwt: string,
    ignoreExpiration = false,
  ): Promise<boolean | any> {
    let payload: boolean | any
    try {
      payload = await this.jwtService.verifyAsync(jwt, {
        secret: this.configService.get<string>('secrets.jwtResetPass'),
        ignoreExpiration,
      })
    } catch (error) {
      payload = false
    }
    return payload
  }
}
