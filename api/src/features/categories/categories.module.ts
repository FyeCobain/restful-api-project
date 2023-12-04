import { Module, forwardRef } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Category, CategorySchema } from './schemas/category.schema'
import { CategoriesRepository } from './categories.repository'

// Import other modules
import { TicketsModule } from '../tickets/tickets.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    UsersModule,
    forwardRef(() => TicketsModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesRepository, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
