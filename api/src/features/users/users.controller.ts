// Core / common imports
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common'

// Swagger imports
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

// Users impórts
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// Validations / Guards / filters imports
import { isValidObjectId } from 'mongoose'
import { MongoExceptionFilter } from '@app/libs/filters'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Creates a new user
  @Post()
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  // Returns all users
  @Get()
  @ApiOkResponse({ description: 'OK' })
  async findAll() {
    return await this.usersService.findAll()
  }

  // Returns one user
  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  // Updates a user and returns it
  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const updatedUser = await this.usersService.update(id, updateUserDto)
    if (!updatedUser) throw new BadRequestException('Wrong user id')
    return updatedUser
  }

  // Deletes a user
  @Delete(':id')
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const deleteResult: any = await this.usersService.remove(id)
    if (deleteResult.deletedCount === 0)
      throw new BadRequestException('Wrong user id')
  }
}
