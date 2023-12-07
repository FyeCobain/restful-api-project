// core / common imports
import { Test, TestingModule } from '@nestjs/testing'

// General repository imports
import { Types } from 'mongoose'
import { DeleteResult } from '@app/database/types'
import { UsersService } from '@features/users/users.service'

// Category schema imports
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { CategoryDocument } from './schemas/category.schema'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

jest.mock('./categories.service')
jest.mock('@features/users/users.service')

describe('CategoriesController', () => {
  let controller: CategoriesController
  let service: CategoriesService
  const houseWorkingId = '656f818c9e250d1194789171' // Houseworking category
  const createCategoryDto: CreateCategoryDto = {
    name: 'Social',
    description: 'Tickets about social things goese here...',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, UsersService],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
    service = module.get<CategoriesService>(CategoriesService)
    jest.clearAllMocks()
  })

  describe('create', () => {
    let createdCategory: CategoryDocument

    beforeEach(async () => {
      jest.spyOn(service, 'create')
      createdCategory = await controller.create(createCategoryDto)
    })

    it('Should call categoriesService.create() passig it the CreateCategoryDto', () => {
      expect(service.create).toHaveBeenCalledWith(createCategoryDto)
    })

    it('Should return the new created category', () => {
      expect(createdCategory._id).toBeInstanceOf(Types.ObjectId)
      expect(createdCategory.name).toBe(createCategoryDto.name)
    })
  })

  describe('findAll', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      jest.spyOn(service, 'findAll')
      categories = await controller.findAll()
    })

    it('Should call categoriesService passing it null', () => {
      expect(service.findAll).toHaveBeenCalledWith(null)
    })

    it("Should return the categories where the first one is 'Frontend'", () => {
      expect(categories[0].name).toBe('Frontend')
    })
  })

  describe('findAll (ascending)', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      jest.spyOn(service, 'findAll')
      categories = await controller.findAll('asc')
    })

    it("Should call categoriesService passing it 'asc'", () => {
      expect(service.findAll).toHaveBeenCalledWith('asc')
    })

    it("Should return the categories where the first one is 'Backend'", () => {
      expect(categories[0].name).toBe('Backend')
    })
  })

  describe('findAll (descending)', () => {
    let categories: CategoryDocument[]

    beforeEach(async () => {
      jest.spyOn(service, 'findAll')
      categories = await controller.findAll('desc')
    })

    it("Should call categoriesService passing it 'desc'", () => {
      expect(service.findAll).toHaveBeenCalledWith('desc')
    })

    it("Should return the categories where the first one is 'Learning'", () => {
      expect(categories[0].name).toBe('Learning')
    })
  })

  describe('findOne', () => {
    let findedCategory: CategoryDocument

    beforeEach(async () => {
      jest.spyOn(service, 'findOne')
      findedCategory = await controller.findOne(houseWorkingId) // Searching 'Houseworking'
    })

    it('Should call categoriesService.finOne() passing it the id', () => {
      expect(service.findOne).toHaveBeenCalledWith(houseWorkingId)
    })

    it("Should return the category with the name 'Houseworking'", () => {
      expect(findedCategory.name).toBe('Houseworking')
    })
  })

  describe('update', () => {
    let updatedCategory: CategoryDocument
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Houseworks',
      description: 'Houseworking is now Houseworks',
    }

    beforeEach(async () => {
      jest.spyOn(service, 'update')
      // Updating 'Houseworking'
      updatedCategory = await controller.update(
        houseWorkingId,
        updateCategoryDto,
      )
    })

    it('Should call categoriesService.finOne() passing it the id and UpdateCategoryDto', () => {
      expect(service.update).toHaveBeenCalledWith(
        houseWorkingId,
        updateCategoryDto,
      )
    })

    it("Should return the category with the name updated to 'Houseworks'", () => {
      expect(updatedCategory.name).toBe('Houseworks')
    })
  })

  describe('remove - with a non deleteable category (with tickets associated)', () => {
    let tryToDelete

    beforeEach(async () => {
      //jest.spyOn(service, 'remove')
      // Callback to try to delete 'Houseworking'
      tryToDelete = () => controller.remove(houseWorkingId)
    })

    it('categoriesService.remove() should not remove it', () => {
      expect(tryToDelete).rejects.toBe(null)
    })
  })

  describe('remove - with a deleteable category', () => {
    let deleteResult: DeleteResult
    let createdCategory: CategoryDocument

    beforeEach(async () => {
      // Inserting a new category
      createdCategory = await service.create(createCategoryDto)

      // Deleting the new category
      jest.spyOn(service, 'remove')
      deleteResult = await controller.remove(createdCategory._id.toString())
    })

    it('should remove the category', () => {
      expect(deleteResult.deletedCount).toBeGreaterThanOrEqual(1)
    })
  })
})
