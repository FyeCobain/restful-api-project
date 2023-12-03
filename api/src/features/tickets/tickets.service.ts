import { Injectable, BadRequestException } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketsRepository } from './tickets.repository'
import { DeleteResultPromise } from '@app/database/types'
import { UsersService } from '@features/users/users.service'

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    // Checking if the user is valid
    if (!(await this.usersService.findByEmail(createTicketDto.assignee)))
      throw new BadRequestException('Assignee does not exist!')

    const createdTicket = await this.ticketsRepository.create(createTicketDto)
    createdTicket.active = undefined // 'active' property will be hidden to users
    return createdTicket
  }

  async findAll(order: string = null, category: string = null, limit, page) {
    // Sorting function depending on order value
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let sortFn = (ticketA, ticketB) => 1 // No sorting at all
    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order === 'asc' || order === 'desc') {
        // Sorting by dueDate ascending or descending, tickets without due date go the end
        sortFn = (ticketA, tickeB) => {
          if (
            typeof ticketA.dueDate !== 'undefined' &&
            typeof tickeB.dueDate !== 'undefined'
          ) {
            if (ticketA.dueDate > tickeB.dueDate)
              return order === 'asc' ? 1 : -1
            else return order === 'asc' ? -1 : 1
          } else if (typeof ticketA.dueDate !== 'undefined') return -1
          return 1
        }
      }
    }

    // Filter query depending on category value
    let filterQuery: Record<string, unknown> = { active: true }
    if (category !== null) filterQuery = { active: true, category }

    const tickets = (await this.ticketsRepository.find(filterQuery)).sort(
      sortFn,
    )

    return tickets
  }

  async findOne(id: string) {
    return await this.ticketsRepository.findOne(
      { _id: id, active: true },
      { active: 0 },
    )
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Ticket does not exist!')

    const ticketUpdated = await this.ticketsRepository.findOneAndUpdate(
      { _id: id },
      updateTicketDto,
    )
    ticketUpdated.active = undefined
    return ticketUpdated
  }

  async softRemove(id: string): DeleteResultPromise {
    if (!(await this.findOne(id)))
      throw new BadRequestException('Ticket does not exist!')

    // Applying soft deleting
    await this.ticketsRepository.findOneAndUpdate(
      { _id: id },
      { active: false },
    )
    return { acknowledged: true, deletedCount: 1 }
  }
}
