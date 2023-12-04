import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@app/database/entity.repository'
import { Category, CategoryDocument } from './schemas/category.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class CategoriesRepository extends EntityRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name) categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel)
  }
}
