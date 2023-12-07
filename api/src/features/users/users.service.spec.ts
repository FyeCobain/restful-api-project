// Core / common imports
import { Types } from 'mongoose'
import { Test, TestingModule } from '@nestjs/testing'

// General repository imports
import { DeleteResult } from '@app/database/types'

// User schema imports
import { UsersService } from './users.service'
import { UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

jest.mock('./users.service')

describe('UsersService', () => {
  let service: UsersService
  const michaelScott = '656963130aafdd90a149b079' // <- Michael Scott (index 1)
  let newUserId: string

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  // create method
  describe('create', () => {
    let user: UserDocument
    const createUserDto: CreateUserDto = {
      name: 'Dwight',
      lastName: 'Schrute',
      email: 'dwight.schrute@example.com',
      password: 'Sp1derm@n',
    }

    beforeEach(async () => {
      user = await service.create(createUserDto)
      newUserId = user._id.toString()
    })

    it('Should return the new created user', () => {
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.name).toBe(createUserDto.name)
    })
  })

  // update method
  describe('update', () => {
    let user: UserDocument
    const updateUserDto: UpdateUserDto = {
      name: 'Dwight Kurt',
    }

    beforeEach(async () => {
      user = await service.update(newUserId, updateUserDto)
    })

    it('Should return the user already updated', () => {
      expect(user.name).toBe(updateUserDto.name)
    })
  })

  // findAll method
  describe('findAll', () => {
    let users: UserDocument[]

    beforeEach(async () => {
      users = await service.findAll()
    })

    it('Should return the list of users', () => {
      expect(users.length).toBeGreaterThanOrEqual(1)
    })
  })

  // findByEmail method
  describe('findByEmail', () => {
    let user: UserDocument
    const email = 'john.doe@example.com'

    beforeEach(async () => {
      user = await service.findByEmail(email)
    })

    it('should return the found user', () => {
      expect(user.email).toBe(email)
    })
  })

  // remove / delete method
  describe('remove', () => {
    let result: DeleteResult

    beforeEach(async () => {
      result = await service.remove(michaelScott) // <- Removing Michael Scott
    })

    it('should return the delete result with deletedCount = 1', () => {
      expect(result.deletedCount).toBe(1)
    })
  })

  // findOne method
  describe('findOne', () => {
    let user: UserDocument

    beforeEach(async () => {
      user = await service.findOne(michaelScott) // <- Michael Scott already removed!
    })

    it('should NOT return the previously deleted user', () => {
      expect(user).toBeUndefined()
    })
  })
})
