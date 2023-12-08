// Core / common imports
import { Test, TestingModule } from '@nestjs/testing'

// General repository imports
import { DeleteResult } from '@app/database/types'

// Ticket schema import
import { TicketsService } from './tickets.service'
import { TicketDocument } from './schemas/ticket.schema'
import { UpdateTicketDto } from './dto/update-ticket.dto'

jest.mock('./tickets.service')

describe('TicketsService', () => {
  let service: TicketsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService],
    }).compile()

    service = module.get<TicketsService>(TicketsService)
  })

  //findAll method
  describe('findAll (John Doe - without filters or limits)', () => {
    const assignee = 'john.doe@example.com' // John Doe (index 0)
    const order: string = null // No ordering
    const category: string = null // No filtering by
    const limit = 0 // No limit
    const page = 0 // No pagination
    let tickets

    beforeEach(async () => {
      tickets = await service.findAll(assignee, order, category, limit, page)
    })

    it("Should return the John Doe's 13 tickets", () => {
      expect(tickets.length).toBe(13)
    })

    it("The title of the first one must start with '01'", () => {
      expect(tickets[0].title).toMatch(/^01 -/)
    })

    it("The title of the last one must start with '13'", () => {
      expect(tickets[tickets.length - 1].title).toMatch(/^13 -/)
    })
  })

  //findAll method
  describe("findAll (John Doe - 'Frontend' category, descending due date)", () => {
    const assignee = 'john.doe@example.com' // John Doe (index 0)
    const order = 'desc' // Descending
    const category = 'frontend' // Only 'Frontend' tickets
    const limit = 0 // No limit
    const page = 0 // No pagination
    let tickets

    beforeEach(async () => {
      tickets = await service.findAll(assignee, order, category, limit, page)
    })

    it("Should return the John Doe's 3 tickets with the 'Frontend' category", () => {
      expect(tickets.length).toBe(3)
    })

    it("The due date of the first must be '2024-01-31 23:59:59'", () => {
      expect(tickets[0].dueDate).toMatch(/^2024-01-31T23:59:59/)
    })

    it("The due date of the second must be '2023-12-08 23:59:59'", () => {
      expect(tickets[1].dueDate).toMatch(/^2023-12-08T23:59:59/)
    })

    it('The last one must not have a due date', () => {
      expect(tickets[tickets.length - 1]).not.toHaveProperty('dueDate')
    })
  })

  //findAll method
  describe("findAll (Michael Scott - 'Backend' category, ascending due date)", () => {
    const assignee = 'mike.scott@example.com' // Michael Scott (index 1)
    const order = 'asc' // Ascending
    const category = 'Backend' // Only 'Backend' tickets
    const limit = 0 // No limit
    const page = 0 // No pagination
    let tickets

    beforeEach(async () => {
      tickets = await service.findAll(assignee, order, category, limit, page)
    })

    it("Should return the Michael Scott's 4 tickets with the 'Frontend' category", () => {
      expect(tickets.length).toBe(4)
    })

    it("The due date of the first must be '2023-12-07 22:00:00'", () => {
      expect(tickets[0].dueDate).toMatch(/^2023-12-07T22:00:00/)
    })

    it("The due date of the second must be '2023-12-19 23:59:59'", () => {
      expect(tickets[1].dueDate).toMatch(/^2023-12-19T23:59:59/)
    })

    it('The third and fourth tickets must not have a due date', () => {
      expect(tickets[2]).not.toHaveProperty('dueDate')
      expect(tickets[tickets.length - 1]).not.toHaveProperty('dueDate')
    })
  })

  //findAll method
  describe('findAll (Michael Scott - lmit = 3, page = 3 )', () => {
    const assignee = 'mike.scott@example.com' // Michael Scott (index 1)
    const order = null // No ordering
    const category = null // Only 'Backend' tickets
    const limit = 3 // No limit
    const page = 3 // No pagination

    let tickets

    beforeEach(async () => {
      tickets = await service.findAll(assignee, order, category, limit, page)
    })

    it("Should return Michael Scott's 3 tickets", () => {
      expect(tickets.length).toBe(3)
    })

    it("The titles of the 3 tickets must start from '20' to '22' (3rd page)", () => {
      expect(tickets[0].title).toMatch(/^20 -/)
      expect(tickets[1].title).toMatch(/^21 -/)
      expect(tickets[2].title).toMatch(/^22 -/)
    })
  })

  // findOne method
  describe('findOne', () => {
    const wrongAssignee = 'john.doe@example.com' // Wrong ticket's assignee
    const correctAssignee = 'mike.scott@example.com' // Correct ticket's assignee
    const ticketId = '656fa57ec22336da2e8297c4' // 15 - Get a tooth cleaning
    let shouldNotBeFound: TicketDocument
    let shouldBeFound: TicketDocument

    beforeEach(async () => {
      shouldNotBeFound = await service.findOne(wrongAssignee, ticketId)
      shouldBeFound = await service.findOne(correctAssignee, ticketId)
    })

    it('Should NOT return the ticket for the wrong assignee (John Doe)', () => {
      expect(shouldNotBeFound).toBeUndefined()
    })

    it('Should return the ticket for the correct assignee (Michael Scott)', () => {
      expect(shouldBeFound.title).toMatch(/^15 -/)
    })
  })

  // update method
  describe('update (With valid data)', () => {
    const assignee = 'mike.scott@example.com'
    const ticketId = '656fa57ec22336da2e8297c4' // 15 - Get a tooth cleaning

    const updateTicketDto: UpdateTicketDto = {
      category: 'Houseworking',
    }

    let updatedTicket

    beforeEach(async () => {
      updatedTicket = await service.update(assignee, ticketId, updateTicketDto)
    })

    it('Should return the already updated ticket', () => {
      expect(updatedTicket.category).toBe(updateTicketDto.category)
    })
  })

  // update method
  describe('update (With an invalid new category name)', () => {
    const assignee = 'mike.scott@example.com'
    const ticketId = '656fd27ddef2b916e9cd627b' // 21 - Go to the spa

    const updateTicketDto: UpdateTicketDto = {
      category: 'Social', // <- This category does not exist!
    }

    let tryIt

    beforeEach(async () => {
      tryIt = async () =>
        await service.update(assignee, ticketId, updateTicketDto)
    })

    it('Should NOT update the ticket', () => {
      expect(tryIt).rejects.toBe(null)
    })
  })

  // softRemove method
  describe("softRemove (With another user's ticket", () => {
    const assignee = 'mike.scott@example.com'
    const ticketId = '656f8560c22336da2e829707' // John's -> "01 - Complete the Nest.js project"

    let tryIt

    beforeEach(async () => {
      tryIt = async () => await service.softRemove(assignee, ticketId)
    })

    it('Should NOT remove the ticket cause assignee is wrong', () => {
      expect(tryIt).rejects.toBe(null)
    })
  })

  // softRemove method
  describe("softRemove (With another user's ticket", () => {
    const assignee = 'mike.scott@example.com'
    const ticketId = '656fcd19def2b916e9cd6257' // Michael's -> "18 - Replace SweetAlert"

    let deleteResult: DeleteResult

    beforeEach(async () => {
      deleteResult = await service.softRemove(assignee, ticketId)
    })

    it('Should return the delete result with acknowledged: true and deletedCount: 1', () => {
      expect(deleteResult.acknowledged).toBe(true)
      expect(deleteResult.deletedCount).toBe(1)
    })
  })
})
