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

  async findAll(category: string = null, order: string = null, limit, page) {
    // Pagination
    let skip = 0
    if (limit > 0 && page > 0) skip = (page - 1) * limit
    return await this.ticketsRepository.findAllAndParse(
      category,
      order,
      skip,
      limit,
    )
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
