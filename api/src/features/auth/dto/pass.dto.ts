import { PickType } from '@nestjs/swagger'
import { CreateUserDto } from '@app/features/users/dto/create-user.dto'

export class PasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
