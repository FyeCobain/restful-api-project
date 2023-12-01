// Core / common imports
import { BadRequestException, Injectable } from '@nestjs/common'

// Interface importing
import { UsersServiceInterface } from './interfaces/users.service.interface'

// Repository imports
import { UserDocument } from './schemas/user.schema'
import { UsersRepository } from './users.repository'

// Hashing imports
import * as argon2 from 'argon2'

// DTO / types imports
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { getBlankFieldsErrorMessages } from '@app/helpers/dto'
import { DeleteResult } from '@app/database/types'

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(private readonly userRepository: UsersRepository) {}

  async findOne(id: string): Promise<UserDocument | null> {
    return await this.userRepository.findOne({ _id: id })
  }

  async findAll(): Promise<UserDocument[] | null> {
    return await this.userRepository.find({})
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findOne({ email })
  }

  async create(newUserData: CreateUserDto): Promise<UserDocument> {
    return await this.userRepository.create({
      ...newUserData,
      password: await argon2.hash(newUserData.password),
    })
  }

  async update(
    id: string,
    updatedUserData: UpdateUserDto,
  ): Promise<UserDocument | null> {
    // Checking if blank values where received
    const blankFieldsErrorMessages: string[] =
      getBlankFieldsErrorMessages(updatedUserData)
    if (blankFieldsErrorMessages.length > 0)
      throw new BadRequestException(blankFieldsErrorMessages)

    if ('password' in updatedUserData && updatedUserData.password.trim() !== '')
      updatedUserData.password = await argon2.hash(updatedUserData.password)

    return await this.userRepository.findOneAndUpdate(
      { _id: id },
      updatedUserData,
    )
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.deleteOne({ _id: id })
  }
}
