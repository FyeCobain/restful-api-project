import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoriesRepository } from './categories.repository'
import { DeleteResultPromise } from '@app/database/types'
import { TicketsService } from '../tickets/tickets.service'

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.create(createCategoryDto)
  }

  async findAll(order: string = null) {
    // Verifying order
    let sortObject = {}
    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order === 'asc' || order === 'desc') sortObject = { name: order }
    }

    return await this.categoriesRepository.find({}, {}, 0, 0, sortObject)
  }

  async findOne(id: string) {
    return await this.categoriesRepository.findOne({ _id: id })
  }

  async findByName(name: string) {
    return await this.categoriesRepository.findOne({ name })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Category does not exist!')

    return await this.categoriesRepository.findOneAndUpdate(
      { _id: id },
      updateCategoryDto,
    )
  }

  async remove(id: string): DeleteResultPromise {
    const category = await this.findOne(id)
    if (!category) throw new BadRequestException('Category does not exist')

    // Checking if there are tickets with this category
    const ticketsCount = await this.ticketsService.count(
      { category: category.name },
      0,
      1,
    )
    if (ticketsCount > 0)
      throw new BadRequestException(
        'There are tickets associated with this category',
      )

    return await this.categoriesRepository.deleteOne({ _id: id })
  }
}
