/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateUserDto } from '@app/features/users/dto/create-user.dto'
import { AuthDto } from '../dto/auth.dto'
import { AuthServiceInterface } from '../interfaces/auth.service.interface'
import { JwtsObject } from '../types/jwts.object.type'
import { UsersService } from '@app/features/users/__mocks__/users.service'
import { UserDocument } from '@app/features/users/schemas/user.schema'

export class AuthService implements AuthServiceInterface {
  private usersService: UsersService = new UsersService()

  async hashData(data: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async signUp(createUserDto: CreateUserDto): Promise<JwtsObject> {
    const newUser: UserDocument = await this.usersService.create(createUserDto)
    return this.getTokens(
      newUser._id.toString(),
      newUser.email,
      newUser.accountType,
    )
  }

  async signIn(authDto: AuthDto): Promise<JwtsObject> {
    const user = await this.usersService.findByEmail(authDto.email)
    return this.getTokens(user._id.toString(), user.email, user.accountType)
  }

  async logOut(userId: string) {
    await this.usersService.update(userId, { refreshToken: null })
  }

  async getTokens(
    userId: string,
    email: string,
    accountType: string,
  ): Promise<JwtsObject> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTY4Y2M1ZGFkYTg2NzY4NGVlNmE1YjYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAxNDU1OTY1LCJleHAiOjE3MDE0NTY4NjV9.hUsjYoPstuj2GNgJz0bk5gVpUB1sswDaleY1XebeFz0',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTY4Y2M1ZGFkYTg2NzY4NGVlNmE1YjYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAxNDU1OTY1LCJleHAiOjE3MDIwNjA3NjV9.b4KAcoHmP5CdLU35o51iaEQkvchbwUVActMqZayag1I',
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    this.usersService.update(userId, {
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTY4Y2M1ZGFkYTg2NzY4NGVlNmE1YjYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAxNDU2Njk1LCJleHAiOjE3MDIwNjE0OTV9.tgQ9evZaMbWP8Hodh2zjWcKxy5hBnQZByx9mYVig8y0',
    })
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<JwtsObject> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTY4Y2M1ZGFkYTg2NzY4NGVlNmE1YjYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAxNDY2MDE0LCJleHAiOjE3MDE0NjY5MTR9.kpcZeK0DfAKcVt_PuZGbkbpmWskL8x-msSU5hYNuVfU',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTY4Y2M1ZGFkYTg2NzY4NGVlNmE1YjYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAxNDY2MDE0LCJleHAiOjE3MDIwNzA4MTR9.wesys1Fsyg7sftyQyS2TOPbv0rkWRFKDFuOWKp7tJwI',
    }
  }

  async createResetPassToken(emailAddress: string): Promise<string> {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwMTQ1Nzc2MywiZXhwIjoxNzAxNDY0OTYzfQ.cIX4zD7tw_XVK_RqdKxVMhjjrnA828OF_BQdcEO473k'
  }

  resetPassword(jwt: string, newPassword: string) {
    throw new Error('Method not implemented.')
  }

  getTokenPayload(jwt: string, ignoreExpiration: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
