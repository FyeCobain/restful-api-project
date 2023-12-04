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
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'

// Swagger
import {
  ApiTags,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

// Filters / guards
import { MongoExceptionFilter } from '@app/libs/filters'
import { IdValidGuard } from '../users/guards'

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Creates and returns a ticket
  @Post()
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketsService.create(createTicketDto)
  }

  // Finds and returns all tickets with the optional sorting and filtering query parameters
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
    description: 'Limit of tickets per page (0 = no limit)',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Current page number (0 = no pagination)',
    required: false,
  })
  @ApiOkResponse({ description: 'OK' })
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

  // Returns a single ticket
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(id)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  // Updates and returns a ticket (already updated)
  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketsService.update(id, updateTicketDto)
  }

  // Performs a soft delete on a ticket
  @Delete(':id')
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) {
    return await this.ticketsService.softRemove(id)
  }
}
