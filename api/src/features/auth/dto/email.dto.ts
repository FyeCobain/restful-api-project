import { PickType } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'

// DTO for only email
export class EmailDto extends PickType(AuthDto, ['email'] as const) {}
