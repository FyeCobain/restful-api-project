// importing schema
import { UserDocument } from '../schemas/user.schema'

// Importing DTOs / types
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { DeleteResult } from '@app/database/types'

// Interface for the UsersService
export interface UsersServiceInterface {
  findOne(id: string): Promise<UserDocument>

  findAll(): Promise<UserDocument[]>

  findByEmail(emailAddress: string): Promise<UserDocument>

  create(newUserData: CreateUserDto): Promise<UserDocument>

  update(id: string, updatedUserData: UpdateUserDto): Promise<UserDocument>

  remove(id: string): Promise<DeleteResult>
}
