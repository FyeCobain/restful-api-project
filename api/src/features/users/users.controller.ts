// Core / common imports
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  UseFilters,
  UseGuards,
} from '@nestjs/common'

// Swagger imports
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

// Users imports
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// Validations / Guards / filters imports
import { MongoExceptionFilter } from '@app/libs/filters'
import { AccessTokenGuard, SubCanAccessGuard } from '@features/auth/guards'
import { IdValidGuard } from '@app/guards'

// Types imports
import { DeleteResult } from '@app/database/types'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Creates and returns a new user
  @Post()
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  // Updates an returns a user with the new data
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, SubCanAccessGuard, IdValidGuard)
  @UseFilters(MongoExceptionFilter)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto)
    if (!updatedUser) throw new BadRequestException('Wrong user id')
    return updatedUser
  }

  // Deletes a user
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, SubCanAccessGuard, IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    const deleteResult: DeleteResult = await this.usersService.remove(id)
    if (deleteResult.deletedCount === 0)
      throw new BadRequestException('Wrong user id')
    return deleteResult
  }
}
