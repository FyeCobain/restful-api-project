import { JwtsObject } from '../types/jwts.object.type'
import { AuthDto } from '../dto/auth.dto'
import { CreateUserDto } from '@app/features/users/dto/create-user.dto'

// Interface for the AuthService
export interface AuthServiceInterface {
  hashData(data: string): Promise<string>

  signUp(createUserDto: CreateUserDto): Promise<JwtsObject>

  signIn(authDto: AuthDto): Promise<JwtsObject>

  logOut(userId: string)

  getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): Promise<JwtsObject>

  updateRefreshToken(userId: string, refreshToken: string)

  refreshTokens(userId: string, refreshToken: string)

  createResetPassToken(emailAddress: string): Promise<string>

  resetPassword(jwt: string, newPassword: string)

  getTokenPayload(jwt: string, ignoreExpiration): Promise<boolean | any>
}
