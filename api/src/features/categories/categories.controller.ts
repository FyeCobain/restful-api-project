import {
  Controller,
  Get,
  Post,
  Body,
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
import { MongoExceptionFilter } from '@app/libs/filters'
import { IdValidGuard } from '@app/guards'

// Swagger
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll()
  }

  @Get(':id')
  @UseGuards(IdValidGuard)
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id)
    if (!category) throw new NotFoundException()
    return category
  }

  @Patch(':id')
  @UseGuards(IdValidGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(IdValidGuard)
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id)
  }
}
