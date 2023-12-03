import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'
import { DeleteResult } from './types'

// Anstract repository class
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        __v: 0,
        ...projection,
      })
      .exec()
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    skipAmount = 0,
    limitAmount = 0,
    sortObject = {},
  ): Promise<T[]> {
    return this.entityModel
      .find(entityFilterQuery, {
        __v: 0,
        ...projection,
      })
      .skip(skipAmount)
      .limit(limitAmount)
      .sort(sortObject)
      .exec()
  }

  async create(createEntityDto: unknown): Promise<T> {
    const newEntity: T = new this.entityModel(createEntityDto)
    const createdEntity: T = await newEntity.save()
    if (createdEntity) createdEntity.__v = undefined
    return createdEntity
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityDto: UpdateQuery<T>,
  ): Promise<T | null> {
    const foundEntity: T | null = await this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityDto,
      { new: true },
    )
    if (foundEntity) foundEntity.__v = undefined
    return foundEntity
  }

  async deleteOne(entityFilterQuery: FilterQuery<T>): Promise<DeleteResult> {
    return await this.entityModel.deleteOne(entityFilterQuery)
  }
}
