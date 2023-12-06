// Core / common imports
import { MongooseModule } from '@nestjs/mongoose'
import { seeder } from 'nestjs-seeder'
import { ConfigModule } from '@nestjs/config'

// User imports
import { User, UserSchema } from './features/users/schemas/user.schema'
import { UsersSeeder } from './features/users/users.seeder'

// Category imports
import {
  Category,
  CategorySchema,
} from './features/categories/schemas/category.schema'
import { CategoriesSeeder } from './features/categories/categories.seeder'

// Ticket imports
import { Ticket, TicketSchema } from './features/tickets/schemas/ticket.schema'
import { TicketsSeeder } from './features/tickets/tickets.seeder'

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
}).run([UsersSeeder, CategoriesSeeder, TicketsSeeder])
