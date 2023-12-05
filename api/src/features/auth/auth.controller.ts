// Common / core imports
import {
  Controller,
  Query,
  Body,
  Get,
  Post,
  Patch,
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
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

// Validation / Guards / filters imports
import { AccessTokenGuard, RefreshTokenGuard } from './guards'
import { MongoExceptionFilter } from '@app/libs/filters'

// DTOs imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'
import { EmailDto } from './dto/email.dto'
import { PasswordDto } from './dto/pass.dto'
import { getPayloadValue, getPayloadSub } from '@app/helpers/auth'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Creates a new user and returns the tokens
  @Post('signup')
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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

  // Endpoint for requesting a password reset
  @Post('resetpassrequest')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @HttpCode(HttpStatus.OK)
  async resetPasswordRequest(@Body() data: EmailDto) {
    const jwt = await this.authService.createResetPassToken(
      data.email.toLowerCase().trim(),
    )
    return {
      done: 'Soon you must receive an email with the password reset link',
      reset_pass_jwt: jwt,
    }
  }

  // Endpoint for reseting password
  @Patch('resetpass')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Query('token') token: string,
    @Body() data: PasswordDto,
  ) {
    await this.authService.resetPassword(token, data.password)
  }

  // Performs the tokens refreshing
  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async refreshTokens(@Req() req: any) {
    return await this.authService.refreshTokens(
      getPayloadSub(req),
      getPayloadValue(req, 'refreshToken'),
    )
  }

  // Performs the logout (deletes the refresh token)
  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async logout(@Req() req: any) {
    await this.authService.logOut(getPayloadSub(req))
  }
}
