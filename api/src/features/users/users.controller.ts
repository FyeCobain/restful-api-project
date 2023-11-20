// Core / common imports
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common'

// Users impórts
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// Validations / Guards / filters imports
import { isValidObjectId } from 'mongoose'
import { MongoExceptionFilter } from '@app/libs/filters'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Creates a new user
  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  // Returns all users
  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  // Returns one user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  // Updates a user and returns it
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const updatedUser = await this.usersService.update(id, updateUserDto)
    if (!updatedUser) throw new BadRequestException('Wrong user id')
    return updatedUser
  }

  // Deletes a user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Incorrect id format')
    const deleteResult: any = await this.usersService.remove(id)
    if (deleteResult.deletedCount === 0)
      throw new BadRequestException('Wrong user id')
  }
}
