// General repository imports
import { DeleteResultPromise, RecordObject } from '@app/database/types'
import { Types } from 'mongoose'

// Ticket schema imports
import { TicketsServiceInterface } from '../interfaces/tickets.service.interface'
import { CreateTicketDto } from '../dto/create-ticket.dto'
import { UpdateTicketDto } from '../dto/update-ticket.dto'
import { TicketDocument } from '../schemas/ticket.schema'
import { TicketPromise, TicketArrayPromise } from '../types'
import { ticketsStub } from './tickets.stub'

// Category schema imports
import { CategoryDocument } from '@app/features/categories/schemas/category.schema'
import { categoriesStub } from '@app/features/categories/__mocks__/categories.stub'

// User schema imports
import { UserDocument } from '@app/features/users/schemas/user.schema'
import { usersStub } from '@app/features/users/__mocks__/users.stub'

// Helpers imports
import { titleize } from '@app/helpers/strings'

export class TicketsService implements TicketsServiceInterface {
  private tickets: TicketDocument[] = ticketsStub()
  private users: UserDocument[] = usersStub()
  private categories: CategoryDocument[] = categoriesStub()

  async create(createTicketDto: CreateTicketDto): TicketPromise {
    // Checking if assignee exists
    const assigneeExists = this.users.some(
      (user) => user.email === createTicketDto.assignee.trim().toLowerCase(),
    )
    if (!assigneeExists) return Promise.reject(null)

    // Creating and returning the new user
    const newTicket: TicketDocument = {
      _id: new Types.ObjectId(),
      ...createTicketDto,
    } as TicketDocument
    this.tickets.push(newTicket)
    return newTicket
  }

  async findLimitedAndSorted(
    assignee,
    order = null,
    category = null,
    skip = 0,
    limit = 0,
  ): TicketArrayPromise {
    let current = 0
    let skipped = 0
    let foundTickets = this.tickets.filter((ticket) => {
      if (
        assignee == ticket.assignee &&
        (category == null || category === ticket.category) &&
        (limit == 0 || current < limit)
      )
        if (ticket.assignee === assignee)
          if (skipped < skip) skipped++
          else {
            current++
            return ticket
          }
    })

    // Sorting by due date ascending or descending
    if (order !== null) {
      const ticketsWithDueDateSorted = foundTickets
        .filter((ticket) => typeof ticket.dueDate !== 'undefined')
        .sort((ticketA, ticketB) => {
          if (order === 'asc') return ticketA.dueDate > ticketB.dueDate ? 1 : -1
          else return ticketA.dueDate < ticketB.dueDate ? 1 : -1
        })

      const ticketsWithoutDueDate = foundTickets.filter(
        (ticket) => typeof ticket.dueDate === 'undefined',
      )

      foundTickets = ticketsWithDueDateSorted.concat(ticketsWithoutDueDate)
    }
    return foundTickets
  }

  async count(
    assignee: string,
    filterQuery: RecordObject,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skip = 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit = 0,
  ): Promise<number> {
    return this.tickets.length
  }

  async findAll(
    assignee: string,
    order: string = null,
    category: string = null,
    limit = 0,
    page = 0,
  ): TicketArrayPromise {
    // Verifying order
    if (order !== null) {
      order = order.trim().toLowerCase()
      if (order !== 'asc' && order !== 'desc') order = null
    }

    // Verifying category
    if (category !== null) category = titleize(category.trim())

    // Pagination
    let skip = 0
    if (limit > 0 && page > 0) skip = (page - 1) * limit

    // Getting tickets unsorted
    const unsortedTickets = this.findLimitedAndSorted(
      assignee,
      order,
      category,
      skip,
      limit,
    )
    return unsortedTickets
  }

  async findOne(assignee: string, id: string): TicketPromise {
    return this.tickets.find(
      (t) => t.assignee === assignee && t._id.toString() === id,
    )
  }

  async update(
    assignee: string,
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): TicketPromise {
    // Getting ticket
    const ticket: TicketDocument = await this.findOne(assignee, id)
    if (!ticket) return null

    // Validating new assignee
    if (typeof updateTicketDto.assignee !== 'undefined') {
      const assigneeExists = this.users.some(
        (user) => user.email === updateTicketDto.assignee.trim().toLowerCase(),
      )
      if (!assigneeExists) return Promise.reject(null)
      ticket.assignee = updateTicketDto.assignee.trim().toLowerCase()
    }

    // Validating new category
    if (typeof updateTicketDto.category !== 'undefined') {
      const categoryExist = this.categories.some(
        (category) =>
          category.name === titleize(updateTicketDto.category.trim()),
      )
      if (!categoryExist) return Promise.reject(null)
      ticket.category = titleize(updateTicketDto.category.trim())
    }

    if (typeof updateTicketDto.title !== 'undefined')
      ticket.title = updateTicketDto.title.trim().toLowerCase()

    if (typeof updateTicketDto.description !== 'undefined')
      ticket.description = updateTicketDto.description.trim().toLowerCase()

    if (typeof updateTicketDto.dueDate !== 'undefined')
      ticket.dueDate = updateTicketDto.dueDate

    // Saving changes
    this.tickets = this.tickets.map((t) => {
      return t._id === ticket._id ? ticket : t
    })

    return ticket
  }

  async softRemove(assignee: string, id: string): DeleteResultPromise {
    // Finding ticket
    const ticket: TicketDocument = this.tickets.find(
      (t) => t._id.toString() === id,
    )
    if (!ticket) return null

    // Validating assignee
    if (ticket.assignee !== assignee.trim().toLowerCase())
      return Promise.reject(null)

    // Soft deleting the ticket
    ticket.assignee = null
    ticket.active = false

    // Saving changes
    this.tickets = this.tickets.map((t) => {
      return t._id === ticket._id ? ticket : t
    })

    return { acknowledged: true, deletedCount: 1 }
  }
}
