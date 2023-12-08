// Core / common imports
import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'

// Ticket schema imports
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'
import { TicketDocument } from './schemas/ticket.schema'
import { CreateTicketDto } from './dto/create-ticket.dto'

// User schema imports
import { UsersService } from '@features/users/users.service'

jest.mock('@features/users/users.service')
jest.mock('./tickets.service')

describe('TicketsController', () => {
  let controller: TicketsController
  let service: TicketsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService, UsersService],
    }).compile()

    controller = module.get<TicketsController>(TicketsController)
    service = module.get<TicketsService>(TicketsService)
    jest.clearAllMocks()
  })

  // create method with valid data
  describe('create (With valid data)', () => {
    let ticket: TicketDocument
    const createTicketDto: CreateTicketDto = {
      title: 'Buy a Christmas Tree',
      description: 'Must buy a Christmas tree before Christmas Eve',
      assignee: 'john.doe@example.com',
      dueDate: new Date('2023-12-23 23:59:59+0'),
    }

    beforeEach(async () => {
      jest.spyOn(service, 'create')
      ticket = await controller.create(createTicketDto)
    })

    it('Should call ticketsService.create() passing it the CreateTicketDto', () => {
      expect(service.create).toHaveBeenCalledWith(createTicketDto)
    })

    it('Should return the new created ticket', () => {
      expect(ticket._id).toBeInstanceOf(Types.ObjectId)
    })
  })

  // create method with an invalid assignee
  describe('create (With a non existing assignee)', () => {
    const createTicketDto: CreateTicketDto = {
      title: 'Buy a Christmas Tree',
      description: 'Must buy a Christmas tree before Christmas Eve',
      assignee: 'dwight.schrute@example.com',
      dueDate: new Date('2023-12-23 23:59:59+0'),
    }
    let tryIt

    beforeEach(async () => {
      tryIt = () => controller.create(createTicketDto)
    })

    it('Should NOT create the ticket', () => {
      expect(tryIt).rejects.toBe(null)
    })
  })
})
