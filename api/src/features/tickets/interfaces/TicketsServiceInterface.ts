import { DeleteResultPromise } from '@app/database/types'
import { CreateTicketDto } from '../dto/create-ticket.dto'
import { UpdateTicketDto } from '../dto/update-ticket.dto'
import { TicketArrayPromise, TicketPromise } from '../types'

//Interface for the TicketsService
export interface TicketsServiceInterface {
  create(createTicketDto: CreateTicketDto): TicketPromise

  count(
    filterQuery: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<number>

  findAll(
    order: string,
    category: string,
    limit: number,
    page: number,
  ): TicketArrayPromise

  findOne(id: string): TicketPromise

  update(id: string, updateTicketDto: UpdateTicketDto): TicketPromise

  softRemove(id: string): DeleteResultPromise
}
