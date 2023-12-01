import { PickType } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'

export class EmailDto extends PickType(AuthDto, ['email'] as const) {}
