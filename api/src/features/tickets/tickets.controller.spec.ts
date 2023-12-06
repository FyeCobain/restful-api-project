import { Test, TestingModule } from '@nestjs/testing'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'
import { UsersService } from '@features/users/users.service'

jest.mock('@features/users/users.service')
jest.mock('./tickets.service')

describe('TicketsController', () => {
  let controller: TicketsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService, UsersService],
    }).compile()

    controller = module.get<TicketsController>(TicketsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
