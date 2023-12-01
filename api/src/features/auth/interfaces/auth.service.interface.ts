import { AuthDto } from '../dto/auth.dto'
import { CreateUserDto } from '@app/features/users/dto/create-user.dto'
import { JwtsObjectPromise } from '../types'

// Interface for the AuthService
export interface AuthServiceInterface {
  hashData(data: string): Promise<string>

  signUp(createUserDto: CreateUserDto): JwtsObjectPromise

  signIn(authDto: AuthDto): JwtsObjectPromise

  logOut(userId: string)

  getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): JwtsObjectPromise

  updateRefreshToken(userId: string, refreshToken: string)

  refreshTokens(userId: string, refreshToken: string)

  createResetPassToken(emailAddress: string): Promise<string>

  resetPassword(jwt: string, newPassword: string)

  getTokenPayload(jwt: string, ignoreExpiration): Promise<boolean | any>
}
