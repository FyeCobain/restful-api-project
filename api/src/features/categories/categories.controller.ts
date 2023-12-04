import {
  Controller,
  Query,
  Body,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// Filters / guards
import { AccessTokenGuard, SubExistsGuard } from '../auth/guards'
import { IdValidGuard } from '@app/guards'
import { MongoExceptionFilter } from '@app/libs/filters'

// Swagger
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, SubExistsGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Creates and returns a new category
  @Post()
  @UseFilters(MongoExceptionFilter)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  // Return all the categories, optionally in ascending or descending order
  @ApiQuery({
    name: 'order',
    description: 'Order by name ascending or descending',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @Get()
  @ApiOkResponse({ description: 'OK' })
  async findAll(@Query('order') order: string = null) {
    return await this.categoriesService.findAll(order)
  }

  // Finds and returns a category by its id
  @Get(':id')
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id)
    if (!category) throw new NotFoundException()
    return category
  }

  // Updates a category and returns it alredy updated
  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  // Deletes a category
  @Delete(':id')
  @UseGuards(IdValidGuard)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id)
  }
}
