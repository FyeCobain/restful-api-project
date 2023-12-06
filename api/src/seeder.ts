// Core / common imports
import { MongooseModule } from '@nestjs/mongoose'
import { seeder } from 'nestjs-seeder'
import { ConfigModule } from '@nestjs/config'

// User schema imports
import { User, UserSchema } from './features/users/schemas/user.schema'
import { UsersSeeder } from './features/users/users.seeder'

// Category schema imports
import {
  Category,
  CategorySchema,
} from './features/categories/schemas/category.schema'
import { CategoriesSeeder } from './features/categories/categories.seeder'

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
}).run([UsersSeeder, CategoriesSeeder])
