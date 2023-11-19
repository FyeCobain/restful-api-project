// Common / core imports
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'

// Guard imports
import { AccessTokenGuard, RefreshTokenGuard } from './guards'

// DTOs imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  // Constructor
  constructor(private readonly authService: AuthService) {}

  // Creates a new user and returns the tokens
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto)
  }

  // Authenticates a user
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authData: AuthDto) {
    return await this.authService.signIn(authData)
  }

  // Performs the logout (deletes the refresh token)
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: any) {
    await this.authService.logOut(req.user['sub'])
  }

  // Performs the tokens refreshing
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: any) {
    return await this.authService.refreshTokens(
      req.user['sub'],
      req.user['refreshToken'],
    )
  }
}
