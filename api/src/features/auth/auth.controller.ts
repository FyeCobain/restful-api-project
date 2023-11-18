// Common imports
import { Controller, Post, Body } from '@nestjs/common'

// Service import
import { AuthService } from './auth.service'

// User imports
import { CreateUserDto } from '@features/users/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  // Constructor
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto)
  }
}
