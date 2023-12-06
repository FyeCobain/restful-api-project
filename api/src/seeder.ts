import { MongooseModule } from '@nestjs/mongoose'
import { seeder } from 'nestjs-seeder'
import { User, UserSchema } from './features/users/schemas/user.schema'
import { UsersSeeder } from './features/users/users.seeder'
import { ConfigModule } from '@nestjs/config'

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UsersSeeder])
