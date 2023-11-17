import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// Users service class
@Injectable()
export class UsersService {
  // Constructor
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Creates and returns a new user
  async create(newUserData: CreateUserDto): Promise<UserDocument> {
    const createdUser = await new this.userModel(newUserData)
    return createdUser.save()
  }

  // Returns all users
  async findAll() {
    return await this.userModel.find().exec()
  }

  // Gets and returns a user by its email
  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email }).exec()
  }

  // Gets and returns a user
  async findOne(id: string) {
    return await this.userModel.findById(id).exec()
  }

  // Updates and returns a user
  async update(id: string, updatedUserData: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    })
  }

  // Deletes an user
  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id }).exec()
  }
}
