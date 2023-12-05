import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@app/database/entity.repository'
import { Ticket, TicketDocument } from './schemas/ticket.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PipelineStage } from 'mongoose'
import { RecordObject } from '@app/database/types'

@Injectable()
export class TicketsRepository extends EntityRepository<TicketDocument> {
  constructor(@InjectModel(Ticket.name) ticketModel: Model<TicketDocument>) {
    super(ticketModel)
  }

  // Returns the tickets using the filter and sorting parameters received
  async findAllAndParse(
    assignee = null,
    order: string = null,
    category: string = null,
    skip = 0,
    limit = 0,
  ) {
    // If no order needed, returning tickets using the find method...
    if (order === null) {
      let filterQuery: RecordObject = { active: true }
      if (assignee !== null) filterQuery = { ...filterQuery, assignee }
      if (category !== null) filterQuery = { ...filterQuery, category }
      return await this.find(filterQuery, { active: 0 }, skip, limit)
    }

    // Using aggregation to filter and sort the tickets...
    let subFilterObject: object
    if (assignee !== null && category === null)
      subFilterObject = { assignee: { $eq: assignee } }
    else if (assignee === null && category !== null)
      subFilterObject = { category: { $eq: category } }
    else if (assignee !== null && category !== null)
      subFilterObject = {
        $and: [
          { assignee: { $eq: assignee } },
          { category: { $eq: category } },
        ],
      }
    else subFilterObject = { _id: { $exists: true } }

    const pipelines: PipelineStage[] = [
      {
        // Selecting tickets with due date and sorting them by it
        $match: {
          $and: [
            { active: true },
            { dueDate: { $exists: true } },
            { dueDate: { $not: /^\s*null\s*$/ } },
            subFilterObject,
          ],
        },
      },
      {
        $sort: { dueDate: order === 'asc' ? 1 : -1 },
      },
      {
        $project: { __v: 0, active: 0 },
      },
      {
        // Performing union with tickets with no due date
        $unionWith: {
          coll: 'tickets',
          pipeline: [
            {
              $match: {
                $and: [
                  { active: true },
                  {
                    $or: [
                      { dueDate: { $exists: false } },
                      { dueDate: { $regex: /^\s*null\s*$/ } },
                    ],
                  },
                  subFilterObject,
                ],
              },
            },
            { $project: { __v: 0, active: 0 } },
          ],
        },
      },
    ]

    // Limit must be positive
    if (limit === 0)
      return await this.entityModel.aggregate(pipelines).skip(skip)
    else
      return await this.entityModel.aggregate(pipelines).skip(skip).limit(limit)
  }
}
