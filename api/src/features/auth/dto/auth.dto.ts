import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthDto {
  @ApiProperty({
    description: 'Must be a valid email address.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Must not be empty',
    example: 'Sp1derm@n',
  })
  @IsNotEmpty()
  password: string
}
