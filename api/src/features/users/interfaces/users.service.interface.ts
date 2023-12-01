// Importing DTOs / types
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { DeleteResultPromise } from '@app/database/types'
import { UserDocumentsArrayPromise, UserDocumentPromise } from '../types'

// Interface for the UsersService
export interface UsersServiceInterface {
  findOne(id: string): UserDocumentPromise

  findAll(): UserDocumentsArrayPromise

  findByEmail(emailAddress: string): UserDocumentPromise

  create(newUserData: CreateUserDto): UserDocumentPromise

  update(id: string, updatedUserData: UpdateUserDto): UserDocumentPromise

  remove(id: string): DeleteResultPromise
}
