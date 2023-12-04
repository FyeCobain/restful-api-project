import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'
import { RecordObject, DeleteResult } from './types'

// Anstract repository class
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: RecordObject,
  ): Promise<T | null> {
    return await this.entityModel
      .findOne(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec()
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: RecordObject,
    skip = 0,
    limit = 0,
    sortObject = {},
  ): Promise<T[]> {
    return await this.entityModel
      .find(filterQuery, {
        __v: 0,
        ...projection,
      })
      .skip(skip)
      .limit(limit)
      .sort(sortObject)
      .exec()
  }

  async create(createEntityDto: unknown): Promise<T> {
    const newEntity: T = new this.entityModel(createEntityDto)
    const createdEntity: T = await newEntity.save()
    if (createdEntity) createdEntity.__v = undefined
    return createdEntity
  }

  // Returns the count of entitties found
  async count(
    filterQuery: FilterQuery<T>,
    skipAmount = 0,
    limitAmount = 0,
  ): Promise<number> {
    return await this.entityModel
      .find(filterQuery)
      .skip(skipAmount)
      .limit(limitAmount)
      .count()
      .exec()
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityDto: UpdateQuery<T>,
  ): Promise<T | null> {
    const foundEntity: T | null = await this.entityModel.findOneAndUpdate(
      filterQuery,
      updateEntityDto,
      { new: true },
    )
    if (foundEntity) foundEntity.__v = undefined
    return foundEntity
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<DeleteResult> {
    return await this.entityModel.deleteOne(filterQuery)
  }
}
