import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDocument } from './schemas/user.schema'
import { userStub } from './__mocks__/user.stub'

jest.mock('./users.service')

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  // create endpoint
  describe('create()', () => {
    let user: UserDocument
    const createUserDto: CreateUserDto = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Sp1derm@n',
    }

    beforeEach(async () => {
      user = await controller.create(createUserDto)
    })

    it("should call usersService.create() passing it the user's create DTO", () => {
      expect(service.create).toHaveBeenCalledWith(createUserDto)
    })

    it('should return the created user', () => {
      expect(user).toEqual(userStub())
    })
  })

  // findAll endpoint
  describe('findAll()', () => {
    let users: UserDocument[]

    beforeEach(async () => {
      users = await controller.findAll()
    })

    it('shoul call usersService.findAll()', () => {
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should return an array of users', () => {
      expect(users).toEqual([userStub()])
    })
  })

  // findOne endpoint
  describe('findOne()', () => {
    const userId: string = userStub()._id.toString()
    let user: UserDocument

    beforeEach(async () => {
      user = await controller.findOne(userId)
    })

    it("should call usersService.findOne() passing it the user's id", () => {
      expect(service.findOne).toHaveBeenCalledWith(userId)
    })

    it('should return the found user', () => {
      expect(user).toEqual(userStub())
    })
  })

  // update endpoint
  describe('update()', () => {
    const userId: string = userStub()._id.toString()
    let user: UserDocument
    const updateUserDto: UpdateUserDto = {
      name: 'Johnny',
    }

    beforeEach(async () => {
      user = await controller.update(userId, updateUserDto)
    })

    it("should call usersService.update() passing it the users'id and update DTO", () => {
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto)
    })

    it('should return the alaready updated user', () => {
      expect(user).toEqual(userStub())
    })
  })

  // remove / delete endpoint
  describe('remove()', () => {
    const userId: string = userStub()._id.toString()
    let result: any

    beforeEach(async () => {
      result = await controller.remove(userId)
    })

    it("should call usersService.remove() passing it the user's id", () => {
      expect(service.remove).toHaveBeenCalledWith(userId)
    })

    it('should return nothing', () => {
      expect(result).toEqual(undefined)
    })
  })
})
