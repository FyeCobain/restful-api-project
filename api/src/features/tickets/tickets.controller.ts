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
  Req,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'

// Filters / guards
import { MongoExceptionFilter } from '@app/libs/filters'
import { IdValidGuard } from '@app/guards'

// Swagger
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { AccessTokenGuard, SubExistsGuard } from '../auth/guards'
import { getPayloadEmail } from '@app/helpers/auth'

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, SubExistsGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Creates and returns a new ticket
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
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter by some category name',
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
    @Req() req: any,
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

    return await this.ticketsService.findAll(
      getPayloadEmail(req),
      order,
      category,
      limit,
      page,
    )
  }

  // Returns a single ticket
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(getPayloadEmail(req), id)
    if (!ticket) throw new NotFoundException()
    return ticket
  }

  // Updates and returns a ticket with the new data
  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketsService.update(
      getPayloadEmail(req),
      id,
      updateTicketDto,
    )
  }

  // Performs a soft delete on a ticket
  @Delete(':id')
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return await this.ticketsService.softRemove(getPayloadEmail(req), id)
  }
}
