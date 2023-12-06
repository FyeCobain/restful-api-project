// Core / common imports
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Seeder } from 'nestjs-seeder'
import { Model } from 'mongoose'

// Ticket schema imports
import { Ticket, TicketDocument } from './schemas/ticket.schema'
import { ticketsStub } from './__mocks__/tickets.stub'

@Injectable()
export class TicketsSeeder implements Seeder {
  constructor(
    @InjectModel(Ticket.name) private ticketsModel: Model<TicketDocument>,
  ) {}

  async seed(): Promise<any> {
    await this.drop()
    return this.ticketsModel.insertMany(ticketsStub())
  }

  async drop(): Promise<any> {
    return await this.ticketsModel.deleteMany({})
  }
}
