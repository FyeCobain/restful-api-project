import { userStub } from './user.stub'
import { DeleteResult } from '@app/database/types'

const deleteResult: DeleteResult = {
  acknowledged: true,
  deletedCount: 1,
}

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  findByEmail: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  update: jest.fn().mockResolvedValue(userStub()),
  remove: jest.fn().mockResolvedValue(deleteResult),
})
