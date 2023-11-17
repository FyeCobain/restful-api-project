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
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Creates a new user
  @Post()
  async create(@Body() newUserData: CreateUserDto) {
    return await this.usersService.create(newUserData)
  }

  // Returns all users
  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  // Returns one user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException()
    return user
  }

  // Updates a user and returns it
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserData: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserData)
    if (!updatedUser) throw new NotFoundException()
    return updatedUser
  }

  // Deletes a user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const deleteResult: any = await this.usersService.remove(id)
    if (deleteResult.deletedCount === 0) throw new NotFoundException()
  }
}
