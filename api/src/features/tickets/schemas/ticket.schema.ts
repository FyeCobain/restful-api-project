import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// exporting the TicketDocument type
export type TicketDocument = HydratedDocument<Ticket>

@Schema()
export class Ticket {
  @Prop({
    required: true,
  })
  title: string

  @Prop({
    required: true,
  })
  description: string

  @Prop({
    required: true,
  })
  assignee: string

  @Prop()
  dueDate: Date

  @Prop()
  category: string

  @Prop({
    default: true,
  })
  active: boolean
}

// Exporting the ticket schema
export const TicketSchema = SchemaFactory.createForClass(Ticket)
