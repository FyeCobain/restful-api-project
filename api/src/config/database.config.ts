import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  mongoDBConnectionString:
    'mongodb://localhost:27017/nest-restful' || process.env.MONGODB_URI
}))
