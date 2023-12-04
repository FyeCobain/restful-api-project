import { TicketDocument } from '../schemas/ticket.schema'

export type TicketPromise = Promise<TicketDocument | undefined>

export type TicketArrayPromise = Promise<TicketDocument[]>
