import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@app/database/entity.repository'
import { Ticket, TicketDocument } from './schemas/ticket.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class TicketsRepository extends EntityRepository<TicketDocument> {
  constructor(@InjectModel(Ticket.name) ticketModel: Model<TicketDocument>) {
    super(ticketModel)
  }
}
