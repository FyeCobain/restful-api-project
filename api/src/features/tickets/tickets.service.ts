import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketsRepository } from './tickets.repository'
import { DeleteResultPromise } from '@app/database/types'
import { UsersService } from '@features/users/users.service'
import { TicketsServiceInterface } from './interfaces/TicketsServiceInterface'
import { TicketArrayPromise, TicketPromise } from './types'
import { CategoriesService } from '../categories/categories.service'
import { titleize } from '@app/helpers/strings'

@Injectable()
export class TicketsService implements TicketsServiceInterface {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}

  async create(createTicketDto: CreateTicketDto): TicketPromise {
    // Checking if the user is valid
    if (!(await this.usersService.findByEmail(createTicketDto.assignee)))
      throw new BadRequestException('Assignee does not exist!')

    const createdTicket = await this.ticketsRepository.create(createTicketDto)
    createdTicket.active = undefined // 'active' property will be hidden to users
    return createdTicket
  }

  async count(
    filterQuery: Record<string, unknown>,
    skip = 0,
    limit = 0,
  ): Promise<number> {
    return await this.ticketsRepository.count(
      { active: true, ...filterQuery },
      skip,
      limit,
    )
  }

  async findAll(
    order: string = null,
    category: string = null,
    limit,
    page,
  ): TicketArrayPromise {
    // Verifying order
    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order !== 'asc' && order !== 'desc') order = null
    }

    // Verifying category
    if (category !== null) category = titleize(category.trim())

    // Pagination
    let skip = 0
    if (limit > 0 && page > 0) skip = (page - 1) * limit
    return await this.ticketsRepository.findAllAndParse(
      order,
      category,
      skip,
      limit,
    )
  }

  async findOne(id: string): TicketPromise {
    return await this.ticketsRepository.findOne(
      { _id: id, active: true },
      { active: 0 },
    )
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): TicketPromise {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Ticket does not exist!')

    // Checking if the category is valid
    if (typeof updateTicketDto.category !== 'undefined')
      if (!(await this.categoriesService.findByName(updateTicketDto.category)))
        throw new BadRequestException(
          `Category '${updateTicketDto.category}' does not exist, please create it first`,
        )

    const ticketUpdated = await this.ticketsRepository.findOneAndUpdate(
      { _id: id },
      updateTicketDto,
    )
    ticketUpdated.active = undefined
    return ticketUpdated
  }

  async softRemove(id: string): DeleteResultPromise {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Ticket does not exist')

    // Applying a soft delete
    await this.ticketsRepository.findOneAndUpdate(
      { _id: id },
      { active: false, $unset: { category: '' } },
    )
    return { acknowledged: true, deletedCount: 1 }
  }
}
