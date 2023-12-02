import { Module } from '@nestjs/common'
import { TicketsRepository } from './tickets.repository'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './schemas/ticket.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsRepository, TicketsService],
})
export class TicketsModule {}
