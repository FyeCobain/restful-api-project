import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  mongoDBConnectionString:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-restful', // Local connection by default
}))
