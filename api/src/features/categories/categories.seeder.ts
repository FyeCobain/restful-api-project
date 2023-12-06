// Core / common imports
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Seeder } from 'nestjs-seeder'

// Category schema imports
import { Category, CategoryDocument } from './schemas/category.schema'
import { categoriesStub } from './__mocks__/categories.stub'

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(
    @InjectModel(Category.name)
    private categoriesModel: Model<CategoryDocument>,
  ) {}

  async seed(): Promise<any> {
    await this.drop()
    return this.categoriesModel.insertMany(categoriesStub())
  }

  async drop(): Promise<any> {
    return await this.categoriesModel.deleteMany({})
  }
}
