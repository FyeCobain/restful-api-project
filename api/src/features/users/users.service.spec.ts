import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserDocument } from './schemas/user.schema'
import { DeleteResult } from '@app/database/types'

jest.mock('./users.service')

describe('UsersService', () => {
  let service: UsersService
  const janeDoeId = '656963130aafdd90a149b079' // Jane Doe (index 1)

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  // remove / delete method
  describe('remove', () => {
    let result: DeleteResult

    beforeEach(async () => {
      result = await service.remove(janeDoeId) // Removing Jane Doe
    })

    it('should return the delete result with deletedCount = 1', () => {
      expect(result.deletedCount).toBe(1)
    })
  })

  // findOne method
  describe('findOne', () => {
    let user: UserDocument

    beforeEach(async () => {
      user = await service.findOne(janeDoeId) // Jane Doe already removed
    })

    it('should NOT return the previously deleted user', () => {
      expect(user).toBeUndefined()
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
})
