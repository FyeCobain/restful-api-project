import { registerAs } from '@nestjs/config'

export default registerAs('secrets', () => ({
  jwtAccess: process.env.JWT_ACCESS_SECRET,
  jwtRefresh: process.env.JWT_REFRESH_SECRET,
  jwtResetPass: process.env.JWT_RESET_PASS_SECRET,
}))
