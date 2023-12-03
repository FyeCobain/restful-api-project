import { Module } from '@nestjs/common'
import { TicketsRepository } from './tickets.repository'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './schemas/ticket.schema'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsRepository, TicketsService],
})
export class TicketsModule {}
