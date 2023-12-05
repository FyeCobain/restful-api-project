import { DeleteResultPromise } from '@app/database/types'
import { CreateTicketDto } from '../dto/create-ticket.dto'
import { UpdateTicketDto } from '../dto/update-ticket.dto'
import { TicketArrayPromise, TicketPromise } from '../types'

//Interface for the TicketsService
export interface TicketsServiceInterface {
  create(createTicketDto: CreateTicketDto): TicketPromise

  count(
    assignee: string,
    filterQuery: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<number>

  findAll(
    assignee: string,
    order: string,
    category: string,
    limit: number,
    page: number,
  ): TicketArrayPromise

  findOne(assignee: string, id: string): TicketPromise

  update(
    assignee: string,
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): TicketPromise

  softRemove(assignee: string, id: string): DeleteResultPromise
}
