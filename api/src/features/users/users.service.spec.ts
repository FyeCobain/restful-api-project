import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserDocument } from './schemas/user.schema'
import { userStub } from './__mocks__/user.stub'
import { DeleteResult } from '@app/database/types'

jest.mock('./users.service')

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  // findByEmail method
  describe('findByEmail()', () => {
    let user: UserDocument

    beforeEach(async () => {
      user = await service.findByEmail('joe.doe@example.com')
    })

    it('should return the found user', () => {
      expect(user).toEqual(userStub())
    })
  })

  // remove / delete method
  describe('remove()', () => {
    const userId: string = userStub()._id.toString()
    let result: DeleteResult

    beforeEach(async () => {
      result = await service.remove(userId)
    })

    it('should return the delete result with deletedCount = 1', () => {
      expect(result.deletedCount).toEqual(1)
    })
  })
})
