// Core / common imports
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Seeder } from 'nestjs-seeder'
import { Model } from 'mongoose'

// User schema imports
import { User, UserDocument } from './schemas/user.schema'
import { usersStub } from './__mocks__/users.stub'

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed(): Promise<any> {
    await this.drop()
    return this.userModel.insertMany(usersStub())
  }

  async drop(): Promise<any> {
    return await this.userModel.deleteMany({})
  }
}
