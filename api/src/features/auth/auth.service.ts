// Common imports
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
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
      throw new BadRequestException('User already exists!')

    // Hashing new user's password and saving it into de DB
    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: await this.hashData(createUserDto.password),
    })

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
      throw new UnauthorizedException('Password is incorrect')
    // Getting new tokens and updating the refresh token in the DB
    const tokens = await this.getTokens(user.id, user.email, user.accountType)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    // Returning the new tokens
    return tokens
  }

  // Performs the logout (deletes the refresh token)
  async logOut(userId: string) {
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

  // Hash and update the refresh token in the DB
  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: await this.hashData(refreshToken),
    })
  }
}
