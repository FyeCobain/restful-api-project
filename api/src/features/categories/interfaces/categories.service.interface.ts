import { DeleteResultPromise } from '@app/database/types'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CategoryArrayPromise, CategoryPromise } from '../types'

// Interface for the CategoriesService
export interface CategoriesServiceInterface {
  create(createCategoryDto: CreateCategoryDto): CategoryPromise

  findAll(order: string): CategoryArrayPromise

  findOne(id: string): CategoryPromise

  findByName(name: string): CategoryPromise

  update(id: string, updateCategoryDto: UpdateCategoryDto)

  remove(id: string): DeleteResultPromise
}
