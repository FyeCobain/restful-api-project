import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

// DTO for new user creation
export class CreateUserDto {
  // Name
  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty' })
  @MinLength(3, { message: 'Name is too short' })
  name: string

  // Lastname
  @IsNotEmpty()
  @MinLength(3, { message: 'Lastname is too short' })
  lastName: string

  //Email
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail()
  email: string

  // Password
  @ApiProperty({
    description:
      "Should have at least 1 uppercase, 1 number, 1 special char ('-' '_' '.' '@' '$') and at least 8 characters",
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_.@$]).{8,}$/, {
    message: 'Password is not strong enough',
  })
  password: string
}
