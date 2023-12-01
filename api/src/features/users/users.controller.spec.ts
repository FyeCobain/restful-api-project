import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { Types } from 'mongoose'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDocument } from './schemas/user.schema'
import { usersStub } from './__mocks__/users.stub'

jest.mock('./users.service')

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService
  const johnDoeId = '6568cc5dada867684ee6a5b6' // John Doe, index 0
  const janeDoeId = '656963130aafdd90a149b079' // Jane Doe, index 1

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
      name: 'Mike',
      lastName: 'Smith',
      email: 'mike.smith@example.com',
      password: 'Sp1derm@n',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'create')
      user = await controller.create(createUserDto)
    })

    it("should call usersService.create() passing it the user's create DTO", () => {
      expect(service.create).toHaveBeenCalledWith(createUserDto)
    })

    it('should return the created user', () => {
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.email).toBe(createUserDto.email)
    })
  })

  // findAll endpoint
  describe('findAll()', () => {
    let users: UserDocument[]

    beforeEach(async () => {
      jest.spyOn(service, 'findAll')
      users = await controller.findAll()
    })

    it('shoul call usersService.findAll()', () => {
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should return an array of users', () => {
      expect(users).toEqual(usersStub())
    })
  })

  // findOne endpoint
  describe('findOne()', () => {
    let user: UserDocument

    beforeEach(async () => {
      jest.spyOn(service, 'findOne')
      user = await controller.findOne(janeDoeId) // Searching Jane Doe
    })

    it("should call usersService.findOne() passing it the user's id", () => {
      expect(service.findOne).toHaveBeenCalledWith(janeDoeId)
    })

    it('should return the found user', () => {
      expect(user).toEqual(usersStub()[1])
    })
  })

  // update endpoint
  describe('update()', () => {
    let user: UserDocument
    const updateUserDto: UpdateUserDto = {
      name: 'Johnny',
      lastName: 'Doek',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'update')
      user = await controller.update(johnDoeId, updateUserDto) // Updating John Doe
    })

    it("should call usersService.update() passing it the users'id and update DTO", () => {
      expect(service.update).toHaveBeenCalledWith(johnDoeId, updateUserDto)
    })

    it('should return the alaready updated user', () => {
      expect(user.name).toBe(updateUserDto.name)
      expect(user.lastName).toBe(updateUserDto.lastName)
    })
  })

  // remove / delete endpoint
  describe('remove()', () => {
    let result: void

    beforeEach(async () => {
      jest.spyOn(service, 'remove')
      result = await controller.remove(johnDoeId) // Removing John Doe
    })

    it("should call usersService.remove() passing it the user's id", () => {
      expect(service.remove).toHaveBeenCalledWith(johnDoeId)
    })

    it('should return nothing', () => {
      expect(result).toBeUndefined()
    })
  })
})
