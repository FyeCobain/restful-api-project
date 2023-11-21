// Common imports
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'

// JWT / Hashing imports
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'

// Services imports
import { UsersService } from '@features/users/users.service'

// DTOs imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  // Constructor
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Hashes the given string
  async hashData(data: string) {
    return await argon2.hash(data)
  }

  // Signing up a new user
  async signUp(createUserDto: CreateUserDto): Promise<any> {
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
  async signIn(authDto: AuthDto) {
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
  async getTokens(userId: string, email: string, accountType: string) {
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

  // Creates and returns a token for password reset
  async createResetPassToken(email: string) {
    // Checking if user exists
    if (!(await this.usersService.findByEmail(email)))
      throw new BadRequestException('User not found')

    // Returning password reset JWT
    return await this.jwtService.signAsync(
      {
        sub: email,
      },
      {
        secret: this.configService.get<string>('secrets.jwtResetPass'),
        expiresIn: '1m',
      },
    )
  }

  // Resets the user's password
  async resetPassword(jwt: string, newPassword: string) {
    // Getting payload while validating JWT' signature
    const payload = await this.getTokenPayload(jwt, true)
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
  ): Promise<any | boolean> {
    let payload: any | boolean
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