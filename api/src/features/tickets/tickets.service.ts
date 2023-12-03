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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(category: string = null, order: string = null, limit, page) {
    let filterQuery: Record<string, unknown> = { active: true }
    if (category !== null) filterQuery = { ...filterQuery, category }

    const projection: Record<string, unknown> = { active: 0 }

    const skipAmount = 0 // TODO

    const limitAmout = 0 // TODO

    let sortObject = {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let extraSortFn = (taskA, taskB) => 1 // <- No extra sorting by default

    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order === 'asc' || order === 'desc') {
        sortObject = { dueDate: order }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        extraSortFn = (taskA, taskB) => {
          if (typeof taskB.dueDate === 'undefined') return -1 // <- if no due date, go last
          return 1
        }
      }
    }

    return (
      await this.ticketsRepository.find(
        filterQuery,
        projection,
        skipAmount,
        limitAmout,
        sortObject,
      )
    ).sort(extraSortFn)
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
