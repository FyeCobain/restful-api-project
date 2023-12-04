import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoriesRepository } from './categories.repository'
import { DeleteResultPromise } from '@app/database/types'

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.create(createCategoryDto)
  }

  async findAll() {
    return await this.categoriesRepository.find({})
  }

  async findOne(id: string) {
    return await this.categoriesRepository.findOne({ _id: id })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
    )
  }

  async remove(id: string): DeleteResultPromise {
    return await this.categoriesRepository.deleteOne({ _id: id })
  }
}
