import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

// DTO for authentication
export class AuthDto {
  // Email
  @ApiProperty({
    description: 'Must be a valid email address.',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  // Passowrd
  @ApiProperty({
    description: 'Must not be empty',
    example: 'Sp1derm@n',
  })
  @IsNotEmpty()
  password: string
}
