import { TicketDocument } from '../schemas/ticket.schema'
import { ticketsStub } from './tickets.stub'

export class TicketsService {
  private tickets: TicketDocument[] = ticketsStub()
}
