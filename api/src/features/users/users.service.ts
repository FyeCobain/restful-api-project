// Core / common imports
import { BadRequestException, Injectable } from '@nestjs/common'

// Interface importing
import { UsersServiceInterface } from './interfaces/users.service.interface'

// Repository imports
import { UserDocument } from './schemas/user.schema'
import { UsersRepository } from './users.repository'

// Hashing imports
import * as argon2 from 'argon2'

// DTO imports
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { getBlankFieldsErrorMessages } from '@app/helpers/dto'

// Users service class
@Injectable()
export class UsersService implements UsersServiceInterface {
  // Constructor
  //constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  constructor(private readonly userRepository: UsersRepository) {}

  // Gets and returns a user
  async findOne(id: string): Promise<UserDocument | null> {
    return await this.userRepository.findOne({ _id: id })
  }

  // Returns all users
  async findAll(): Promise<UserDocument[] | null> {
    return await this.userRepository.find({})
  }

  // Gets and returns a user by its email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findOne({ email })
  }

  // Creates and returns a new user
  async create(newUserData: CreateUserDto): Promise<UserDocument> {
    return await this.userRepository.create({
      ...newUserData,
      password: await argon2.hash(newUserData.password),
    })
  }

  // Updates and returns a user
  async update(
    id: string,
    updatedUserData: UpdateUserDto,
  ): Promise<UserDocument | null> {
    // Checking if blank values where received
    const blankFieldsErrorMessages: string[] =
      getBlankFieldsErrorMessages(updatedUserData)
    if (blankFieldsErrorMessages.length > 0)
      throw new BadRequestException(blankFieldsErrorMessages)

    // Hashing new password
    if ('password' in updatedUserData && updatedUserData.password.trim() !== '')
      updatedUserData.password = await argon2.hash(updatedUserData.password)

    // Updating and returning the user (already updated)
    return await this.userRepository.findOneAndUpdate(
      { _id: id },
      updatedUserData,
    )
  }

  // Deletes an user
  async remove(id: string): Promise<boolean> {
    return await this.userRepository.deleteOne({ _id: id })
  }
}
