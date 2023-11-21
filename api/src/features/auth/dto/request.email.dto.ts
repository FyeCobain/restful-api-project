import { PickType } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'

// DTO for requesting a new password
export class RequestEmailDto extends PickType(AuthDto, ['email'] as const) {}
