// General repository imports
import { DeleteResultPromise } from '@app/database/types'
import { Types } from 'mongoose'

// Category schema imports
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CategoriesServiceInterface } from '../interfaces/categories.service.interface'
import { CategoryDocument } from '../schemas/category.schema'
import { CategoryPromise, CategoryArrayPromise } from '../types'
import { categoriesStub } from './categories.stub'

// Ticket schema imports
import { TicketDocument } from '@app/features/tickets/schemas/ticket.schema'
import { ticketsStub } from '@app/features/tickets/__mocks__/tickets.stub'

export class CategoriesService implements CategoriesServiceInterface {
  private categories: CategoryDocument[] = categoriesStub()
  private tickets: TicketDocument[] = ticketsStub()

  async create(createCategoryDto: CreateCategoryDto): CategoryPromise {
    const newCategory: CategoryDocument = {
      _id: new Types.ObjectId(),
      ...createCategoryDto,
    } as CategoryDocument
    this.categories.push(newCategory)
    return newCategory
  }

  async findAll(order: string = null): CategoryArrayPromise {
    if (order === 'asc') {
      this.categories.sort((categoryA, categoryB) => {
        return categoryA.name > categoryB.name ? 1 : -1
      })
    } else if (order === 'desc') {
      this.categories.sort((categoryA, categoryB) => {
        return categoryA.name < categoryB.name ? 1 : -1
      })
    }
    return this.categories
  }

  async findOne(id: string): CategoryPromise {
    return this.categories.find((category) => category._id.toString() === id)
  }

  async findByName(name: string): CategoryPromise {
    return this.categories.find((category) => category.name === name)
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): CategoryPromise {
    const category: CategoryDocument = await this.findOne(id)
    category.name = updateCategoryDto.name
    category.description = updateCategoryDto.description
    return category
  }

  async remove(id: string): DeleteResultPromise {
    // Checking if there are tickets associated to this category
    const category: CategoryDocument = await this.findOne(id)
    const inSomeTicket = this.tickets.some(
      (ticket) => ticket.category === category.name,
    )

    //if (inSomeTicket) return { acknowledged: false, deletedCount: 0 }
    if (inSomeTicket) return Promise.reject(null)

    return { acknowledged: true, deletedCount: 1 }
  }
}
