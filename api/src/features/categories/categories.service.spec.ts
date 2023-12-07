import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { CategoryDocument } from './schemas/category.schema'
import { Types } from 'mongoose'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { DeleteResult } from '@app/database/types'

jest.mock('./categories.service')

describe('CategoriesService', () => {
  let service: CategoriesService
  const createCategoryDto: CreateCategoryDto = {
    name: 'Hobbies',
    description: 'Tickets about hobbies goes',
  }
  const healthCareId = '656f81d39e250d119478917a' // 'Healthcare' category

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService],
    }).compile()

    service = module.get<CategoriesService>(CategoriesService)
  })

  // create method
  describe('create', () => {
    let createdCategory: CategoryDocument

    beforeEach(async () => {
      createdCategory = await service.create(createCategoryDto)
    })

    it('Should return the new created category', () => {
      expect(createdCategory._id).toBeInstanceOf(Types.ObjectId)
      expect(createdCategory.name).toBe(createCategoryDto.name)
    })
  })

  // findAll method (no sorting)
  describe('findAll', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      categories = await service.findAll()
    })

    it("Should return the categories where the first one is 'Frontend'", () => {
      expect(categories[0].name).toBe('Frontend')
    })
  })

  // findAll method with 'asc'
  describe('findAll (ascending)', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      categories = await service.findAll('asc')
    })

    it("Should return the categories where the last one is 'Learning'", () => {
      expect(categories[categories.length - 1].name).toBe('Learning')
    })
  })

  // findAll method with 'desc'
  describe('findAll (descending)', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      categories = await service.findAll('desc')
    })

    it("Should return the categories where the last one is 'Backend'", () => {
      expect(categories[categories.length - 1].name).toBe('Backend')
    })
  })

  // findOne method
  describe('findOne', () => {
    let findedCategory: CategoryDocument

    beforeEach(async () => {
      findedCategory = await service.findOne(healthCareId) // Searching 'Healthcare'
    })

    it("Should return the category with the name 'Healthcare'", () => {
      expect(findedCategory.name).toBe('Healthcare')
    })
  })

  // update method
  describe('update', () => {
    let updatedCategory: CategoryDocument
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Healthcare And Exercise',
    }

    beforeEach(async () => {
      updatedCategory = await service.update(healthCareId, updateCategoryDto)
    })

    it("Should return the category with the name updated to 'Healthcare And Exercise'", () => {
      expect(updatedCategory.name).toBe('Healthcare And Exercise')
    })
  })

  // Remove method with non deleteable category
  describe('remove - with a non deleteable category (with tickets associated)', () => {
    let tryToDelete

    beforeEach(async () => {
      // Callback to try to delete 'Healthcare'
      tryToDelete = () => service.remove(healthCareId)
    })

    it('categoriesService.remove() should not remove it', () => {
      expect(tryToDelete).rejects.toBe(null)
    })
  })

  // Remove method with deleteable category
  describe('remove - with a deleteable category', () => {
    let deleteResult: DeleteResult
    let createdCategory: CategoryDocument

    beforeEach(async () => {
      // Inserting a new category
      createdCategory = await service.create(createCategoryDto)

      // Deleting the new category
      deleteResult = await service.remove(createdCategory._id.toString())
    })

    it('should remove the category', () => {
      expect(deleteResult.deletedCount).toBeGreaterThanOrEqual(1)
    })
  })
})
