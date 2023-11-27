// Core / common imports
import { BadRequestException, Injectable } from '@nestjs/common'

// Interface importing
import { UsersServiceInterface } from './interfaces/users.service.interface'

// Mongo imports
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

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
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Creates and returns a new user
  async create(newUserData: CreateUserDto): Promise<UserDocument> {
    const createdUser = await new this.userModel({
      ...newUserData,
      password: await argon2.hash(newUserData.password),
    })
    return createdUser.save()
  }

  // Returns all users
  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find({}, { __v: 0 }).exec()
  }

  // Gets and returns a user by its email
  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec()
  }

  // Gets and returns a user
  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id, { __v: 0 }).exec()
  }

  // Updates and returns a user
  async update(
    id: string,
    updatedUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    // Checking if blank values where received
    const blankFieldsErrorMessages: string[] =
      getBlankFieldsErrorMessages(updatedUserData)
    if (blankFieldsErrorMessages.length > 0)
      throw new BadRequestException(blankFieldsErrorMessages)

    // Hashing new password
    if ('password' in updatedUserData && updatedUserData.password.trim() !== '')
      updatedUserData.password = await argon2.hash(updatedUserData.password)

    // Updating and returning the user (already updated)
    return await this.userModel.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    })
  }

  // Deletes an user
  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id }).exec()
  }
}
