// importing schema
import { UserDocument } from '../schemas/user.schema'

// Importing DTOs / types
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { DeleteResult } from '@app/database/types'

// Interface for the users service methods
export interface UsersServiceInterface {
  // Finds a user
  findOne(id: string): Promise<UserDocument>

  // Finds all users
  findAll(): Promise<UserDocument[]>

  // Finds a user by its email
  findByEmail(emailAddress: string): Promise<UserDocument>

  // Creates and returns a new user
  create(newUserData: CreateUserDto): Promise<UserDocument>

  // Updates a user
  update(id: string, updatedUserData: UpdateUserDto): Promise<UserDocument>

  // Deletes a user
  remove(id: string): Promise<DeleteResult>
}
