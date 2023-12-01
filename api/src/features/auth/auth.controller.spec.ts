import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthDto } from './dto/auth.dto'
import { EmailDto } from './dto/email.dto'
import { JwtsObject } from './types'

jest.mock('./auth.service')

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  // SignUp endpoint
  describe('signUp', () => {
    let jwtsObject: JwtsObject
    const createUserDto: CreateUserDto = {
      name: 'Gary',
      lastName: 'Smith',
      email: 'gary.smith@example.com',
      password: 'Sp1derm@n',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'signUp')
      jwtsObject = await controller.signUp(createUserDto)
    })

    it('should call authService.signUp() passing it the create user Dto', () => {
      expect(service.signUp).toBeCalledWith(createUserDto)
    })

    it('should return an object with the access and refresh tokens', () => {
      expect(jwtsObject).toHaveProperty('accessToken')
      expect(jwtsObject).toHaveProperty('refreshToken')
    })
  })

  // SignUp endpoint
  describe('signIn', () => {
    let jwtsObject: JwtsObject
    const authDto: AuthDto = {
      email: 'john.doe@example.com',
      password: 'Sp1derm@n',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'signIn')
      jwtsObject = await controller.signIn(authDto)
    })

    it('should call authService.signIn() passing it the auth Dto', () => {
      expect(service.signIn).toBeCalledWith(authDto)
    })

    it('should return an object with the access and refresh tokens', () => {
      expect(jwtsObject).toHaveProperty('accessToken')
      expect(jwtsObject).toHaveProperty('refreshToken')
    })
  })

  // resetPasswordRequest endpoint
  describe('resetPasswordRequest', () => {
    let result: object
    const emailDto: EmailDto = {
      email: 'john.doe@example.com',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'createResetPassToken')
      result = await controller.resetPasswordRequest(emailDto)
    })

    it('should call authService.createResetPassToken() passing it the email', () => {
      expect(service.createResetPassToken).toBeCalledWith(emailDto.email)
    })

    it('should return and object with the reset password jwt', () => {
      expect(result).toHaveProperty('done')
      expect(result).toHaveProperty('reset_pass_jwt')
    })
  })

  // refreshTokens endpoint
  describe('refreshTokens', () => {
    let result: any
    const userPayload = { user: {} }

    beforeEach(async () => {
      jest.spyOn(service, 'refreshTokens')
      result = await controller.refreshTokens(userPayload)
    })

    it('should call authService.refreshTokens()', () => {
      expect(service.refreshTokens).toHaveBeenCalled()
    })

    it('should return and object with the new acces and refresh tokens', () => {
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })
  })
})
