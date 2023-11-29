// importing schema
import { UserDocument } from '../schemas/user.schema'

// Importing DTOs
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

// Interface for the users service methods
export interface UsersServiceInterface {
  // Finds a user
  findOne(id: string): Promise<UserDocument | null>

  // Finds all users
  findAll(): Promise<UserDocument[] | null>

  // Finds a user by its email
  findByEmail(emailAddress: string): Promise<UserDocument | null>

  // Creates and returns a new user
  create(newUserData: CreateUserDto): Promise<UserDocument>

  // Updates a user
  update(
    id: string,
    updatedUserData: UpdateUserDto,
  ): Promise<UserDocument | null>

  // Deletes a user
  remove(id: string): Promise<boolean>
}
