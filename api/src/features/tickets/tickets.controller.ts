/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Controller,
  Query,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketsService.create(createTicketDto)
  }

  @ApiQuery({
    name: 'order',
    description: 'Order by due date ascending or descending',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter by some category id',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit per page (0 = no limit)',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Current page (0 = no pagination)',
    required: false,
  })
  @Get()
  async findAll(
    @Query('order') order: string = null,
    @Query('category') category: string = null,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    // Verifying pagination values
    if (isNaN(limit)) limit = 0 // No limit
    else limit = Math.floor(limit)
    if (isNaN(page)) page = 0 // No pagination
    else page = Math.floor(page)
    if (limit < 0 || page < 0)
      throw new BadRequestException('Pagination values cannnot be negative')

    return await this.ticketsService.findAll(order, category, limit, page)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(id)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketsService.update(id, updateTicketDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ticketsService.softRemove(id)
  }
}
