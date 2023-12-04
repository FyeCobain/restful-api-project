import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateTicketDto } from './create-ticket.dto'
import { IsOptional, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { titleize } from '@app/helpers/strings'

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiProperty({
    description: "Optional: The ticket's category name",
    example: 'Backend',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => titleize(value.trim()))
  @MinLength(3, { message: 'Category name is too short' })
  category?: string
}
