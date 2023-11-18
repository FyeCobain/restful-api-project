import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

// DTO for authentication
export class AuthDto {
  // Email
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  // Passowrd
  @ApiProperty()
  @IsNotEmpty()
  password: string
}
