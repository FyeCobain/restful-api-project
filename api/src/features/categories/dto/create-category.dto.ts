import { titleize } from '@app/helpers/strings'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

// DTO for the new category creation
export class CreateCategoryDto {
  @ApiProperty({
    description: 'Must have at least 3 characters other than spaces',
    example: 'Backend',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => titleize(value.trim()))
  @MinLength(3, { message: 'Name is too short' })
  name: string

  @ApiProperty({
    description:
      "Optional: Category's descripton with at least 6 characters other than spaces",
    example: 'Tickets related to backend development',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(6, { message: 'Description is too short' })
  description?: string
}
