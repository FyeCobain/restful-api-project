// Common / core imports
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseFilters,
} from '@nestjs/common'
import { AuthService } from './auth.service'

// Swagger imports
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

// Validation / Guards / filters imports
import { AccessTokenGuard, RefreshTokenGuard } from './guards'
import { MongoExceptionFilter } from '@app/libs/filters'

// DTOs imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // Constructor
  constructor(private readonly authService: AuthService) {}

  // Creates a new user and returns the tokens
  @Post('signup')
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto)
  }

  // Authenticates a user
  @Post('signin')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Rquest' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authData: AuthDto) {
    return await this.authService.signIn(authData)
  }

  // Performs the tokens refreshing
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('refresh')
  async refreshTokens(@Req() req: any) {
    return await this.authService.refreshTokens(
      req.user['sub'],
      req.user['refreshToken'],
    )
  }

  // Performs the logout (deletes the refresh token)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('logout')
  async logout(@Req() req: any) {
    await this.authService.logOut(req.user['sub'])
  }
}
