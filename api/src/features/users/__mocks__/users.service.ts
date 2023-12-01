import { DeleteResult } from '@app/database/types'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UsersServiceInterface } from '../interfaces/users.service.interface'
import { UserDocument } from '../schemas/user.schema'
import { usersStub } from './users.stub'
import { Types } from 'mongoose'
import { UserDocumentPromise, UserDocumentsArrayPromise } from '../types'

// UsersService mock up
export class UsersService implements UsersServiceInterface {
  private users: UserDocument[] = usersStub()

  async findOne(id: string): UserDocumentPromise {
    return await this.users.find((user) => user._id.toString() == id)
  }

  async findAll(): UserDocumentsArrayPromise {
    return await this.users
  }

  async findByEmail(emailAddress: string): UserDocumentPromise {
    return await this.users.find(
      (user) => user.email.toLowerCase() === emailAddress.toLowerCase().trim(),
    )
  }

  async create(newUserData: CreateUserDto): UserDocumentPromise {
    const newUser: UserDocument = {
      _id: new Types.ObjectId(),
      name: newUserData.name,
      lastName: newUserData.lastName,
      email: newUserData.email,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$QM4gzZdRm7ib6LVKu9oM7w$xL06ysBg+fh+PqOKpilR+zm7KL19f0aMZ9LvPIhbwhY',
      validatedAccount: false,
      accountType: 'admin',
      refreshToken: null,
    } as UserDocument
    await this.users.push(newUser)
    return newUser
  }

  async update(
    id: string,
    updatedUserData: UpdateUserDto,
  ): UserDocumentPromise {
    const userIndex: number = this.users.findIndex(
      (user) => user._id.toString() === id,
    )
    if (userIndex < 0) return null

    this.users[userIndex].name = updatedUserData.name
    this.users[userIndex].lastName = updatedUserData.lastName
    this.users[userIndex].email = updatedUserData.email

    return this.users[userIndex]
  }

  async remove(id: string): Promise<DeleteResult> {
    if (!(await this.findOne(id)))
      return { acknowledged: false, deletedCount: 0 }

    this.users = this.users.filter((user) => user._id.toString() !== id)

    return { acknowledged: true, deletedCount: 1 }
  }
}
