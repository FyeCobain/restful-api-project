// Core / common imports
import {
  Injectable,
  Inject,
  forwardRef,
  HttpException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'

// Services / repository imports
import { TicketsRepository } from './tickets.repository'
import { UsersService } from '@features/users/users.service'
import { RecordObject, DeleteResultPromise } from '@app/database/types'
import { CategoriesService } from '../categories/categories.service'

// Interfaces / DTOs imports
import { TicketsServiceInterface } from './interfaces/tickets.service.interface'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketDocument } from './schemas/ticket.schema'
import { TicketArrayPromise, TicketPromise } from './types'

// Helpers imports
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

  // Creates the appropiate filter query based on the assignee and the sub-filter received
  createFilterQuery(
    assignee: string,
    subFilterQuery: RecordObject = {},
  ): RecordObject {
    let filterQuery: RecordObject = { active: true, ...subFilterQuery }
    if (assignee !== null) filterQuery = { ...filterQuery, assignee }
    return filterQuery
  }

  async count(
    assignee: string,
    filterQuery: RecordObject,
    skip = 0,
    limit = 0,
  ): Promise<number> {
    return await this.ticketsRepository.count(
      this.createFilterQuery(assignee, filterQuery),
      skip,
      limit,
    )
  }

  async findAll(
    assignee: string,
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
      assignee,
      order,
      category,
      skip,
      limit,
    )
  }

  async findOne(assignee: string, id: string): TicketPromise {
    const ticket: TicketDocument = await this.ticketsRepository.findOne(
      this.createFilterQuery(null, { _id: id }),
      { active: 0 },
    )
    if (ticket && assignee !== null && ticket.assignee !== assignee)
      throw new ForbiddenException()
    return ticket
  }

  async update(
    assignee: string,
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): TicketPromise {
    // Validating if the ticket exists and the assignee is correct
    const error = await this.getPossibleError(assignee, id)
    if (error) throw error

    // Checking if the category is valid
    if (typeof updateTicketDto.category !== 'undefined')
      if (!(await this.categoriesService.findByName(updateTicketDto.category)))
        throw new BadRequestException(
          `Category '${updateTicketDto.category}' does not exist, please create it first`,
        )

    const ticketUpdated = await this.ticketsRepository.findOneAndUpdate(
      this.createFilterQuery(assignee, { _id: id }),
      updateTicketDto,
    )
    ticketUpdated.active = undefined
    return ticketUpdated
  }

  async softRemove(assignee: string, id: string): DeleteResultPromise {
    // Validating if the ticket exists and the assignee is correct
    const error = await this.getPossibleError(assignee, id)
    if (error) throw error

    // Applying a soft delete
    await this.ticketsRepository.findOneAndUpdate(
      { _id: id },
      { active: false, $unset: { category: '' } },
    )
    return { acknowledged: true, deletedCount: 1 }
  }

  // Returns an http error when the user cannot access the ticket
  async getPossibleError(assignee: string, id: string): Promise<HttpException> {
    const ticket = await this.findOne(null, id)
    if (!ticket)
      return new BadRequestException('Ticket does not exist or is deleted')
    if (ticket.assignee !== assignee) return new ForbiddenException()
    return null
  }
}
