import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketsRepository } from './tickets.repository'

@Injectable()
export class TicketsService {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async create(createTicketDto: CreateTicketDto) {
    return await this.ticketsRepository.create(createTicketDto)
  }

  async findAll() {
    return await this.ticketsRepository.find({})
  }

  async findOne(id: string) {
    return await this.ticketsRepository.findOne({ _id: id })
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return await (this,
    this.ticketsRepository.findOneAndUpdate({ _id: id }, updateTicketDto))
  }

  async remove(id: string) {
    return await this.ticketsRepository.deleteOne({ _id: id })
  }
}
