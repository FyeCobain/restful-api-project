import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

// DTO for the new category creation
export class CreateCategoryDto {
  @ApiProperty({
    description: 'Must have at least 3 characters other than spaces',
    example: 'Housework',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({
    description:
      "Optional: Category's descripton with at least 6 characters other than spaces",
    example: 'Tickets related to housework go here',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  description?: string
}
