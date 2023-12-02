import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEmail,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'

// DTO for the new ticket cration
export class CreateTicketDto {
  @ApiProperty({
    description: 'Must have at least 5 characters other than spaces',
    example: 'Complete the Nest.js project',
  })
  @IsNotEmpty()
  @MinLength(5, { message: 'Title is too short' })
  title: string

  @ApiProperty({
    description: 'Must have at least 5 characters other than spaces',
    example: 'Complete and push the Nest.js project with all the requirements',
  })
  @IsNotEmpty()
  @MinLength(5, { message: 'Description is too short' })
  description: string

  @ApiProperty({
    description: "Must ve a valid registered user's email",
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  assignee: string

  @ApiProperty({
    description: "OptionaL - The ticket's due date",
    example: '2023-12-08 23:59:59+0',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date
}
