import { registerAs } from '@nestjs/config'

export default registerAs('secrets', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
}))
