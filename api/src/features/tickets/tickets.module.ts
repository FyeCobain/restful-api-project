import { Module, forwardRef } from '@nestjs/common'
import { TicketsRepository } from './tickets.repository'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './schemas/ticket.schema'

// Import other modules
import { UsersModule } from '../users/users.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    UsersModule,
    forwardRef(() => CategoriesModule),
  ],
  controllers: [TicketsController],
  providers: [TicketsRepository, TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
