// Types imports
import { JwtsObject } from '../types/jwts.object.type'

// DTOs imports
import { AuthDto } from '../dto/auth.dto'
import { CreateUserDto } from '@app/features/users/dto/create-user.dto'

export interface AuthServiceInterface {
  // Hashes the given string
  hashData(data: string): Promise<string>

  // Signs up a new user
  signUp(createUserDto: CreateUserDto): Promise<JwtsObject>

  // Authenticates a user
  signIn(authDto: AuthDto): Promise<JwtsObject>

  // Performs the logout (deletes the refresh token)
  logOut(userId: string)

  // Creates an returns the user's tokens
  getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): Promise<JwtsObject>

  // Hashes and updates the refresh token in the DB
  updateRefreshToken(userId: string, refreshToken: string)

  // Performs the tokens refreshing
  refreshTokens(userId: string, refreshToken: string)

  // Creates a token for password reset and sends it to the email address
  createResetPassToken(emailAddress: string): Promise<string>

  // Resets the user's password
  resetPassword(jwt: string, newPassword: string)

  // Validates the token and returns the paylaod
  getTokenPayload(jwt: string, ignoreExpiration): Promise<boolean | any>
}
