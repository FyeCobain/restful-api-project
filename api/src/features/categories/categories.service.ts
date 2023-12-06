// Core / common imports
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common'

// Services / repository imports
import { CategoriesRepository } from './categories.repository'
import { DeleteResultPromise } from '@app/database/types'
import { TicketsService } from '../tickets/tickets.service'

// Interfaces / DTOs imports
import { CategoriesServiceInterface } from './interfaces/categories.service.interface'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryArrayPromise, CategoryPromise } from './types'

@Injectable()
export class CategoriesService implements CategoriesServiceInterface {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): CategoryPromise {
    return await this.categoriesRepository.create(createCategoryDto)
  }

  async findAll(order: string = null): CategoryArrayPromise {
    // Verifying order
    let sortObject = {}
    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order === 'asc' || order === 'desc') sortObject = { name: order }
    }

    return await this.categoriesRepository.find({}, {}, 0, 0, sortObject)
  }

  async findOne(id: string): CategoryPromise {
    return await this.categoriesRepository.findOne({ _id: { $eq: id } })
  }

  async findByName(name: string): CategoryPromise {
    return await this.categoriesRepository.findOne({ name: { $eq: name } })
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): CategoryPromise {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Category does not exists!')

    return await this.categoriesRepository.findOneAndUpdate(
      { _id: { $eq: id } },
      updateCategoryDto,
    )
  }

  async remove(id: string): DeleteResultPromise {
    const category = await this.findOne(id)
    if (!category) throw new BadRequestException('Category does not exists')

    // Checking if there are tickets with this category
    const ticketsCount = await this.ticketsService.count(
      null,
      { category: category.name },
      0,
      1,
    )
    if (ticketsCount > 0)
      throw new BadRequestException(
        'There are tickets associated with this category',
      )

    return await this.categoriesRepository.deleteOne({ _id: { $eq: id } })
  }
}
