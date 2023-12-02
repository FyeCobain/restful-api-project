import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateTicketDto } from './create-ticket.dto'
import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiProperty({
    description: "Optional: The ticket's category id",
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  category?: string

  @ApiProperty({
    description: "Optional: the ticket's active state (false = removed)",
    example: true,
  })
  @IsOptional()
  active?: boolean
}
