// Importing DTOs / types
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { DeleteResultPromise } from '@app/database/types'
import { UserPromise, UserArrayPromise } from '../types'

// Interface for the UsersService
export interface UsersServiceInterface {
  findOne(id: string): UserPromise

  findAll(): UserArrayPromise

  findByEmail(emailAddress: string): UserPromise

  create(newUserData: CreateUserDto): UserPromise

  update(id: string, updatedUserData: UpdateUserDto): UserPromise

  remove(id: string): DeleteResultPromise
}
