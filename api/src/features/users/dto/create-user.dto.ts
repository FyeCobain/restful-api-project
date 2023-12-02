import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

// DTO for new user creation
export class CreateUserDto {
  @ApiProperty({
    description: 'Must have at least 3 characters other than spaces',
    example: 'John',
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Name is too short' })
  name: string

  @ApiProperty({
    description: 'Must have at least 3 characters other than spaces',
    example: 'Doe',
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Lastname is too short' })
  lastName: string

  @ApiProperty({
    description: 'Must be a valid email address',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description:
      "Must have at least 1 uppercase, 1 number, 1 special char (\\'-\\' \\'_\\' \\'.\\' \\'@\\' \\'$\\') and a min length of 8 characters",
    example: 'Sp1derm@n',
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_.@$]).{8,}$/, {
    message: 'Password is not strong enough',
  })
  password: string
}
