// Comon and core imports
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

// JWT imports
import { JwtModule } from '@nestjs/jwt'

// Import other modules
import { UsersModule } from '@features/users/users.module'

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
