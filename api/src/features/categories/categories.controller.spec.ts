import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { UsersService } from '@features/users/users.service'

jest.mock('./categories.service')
jest.mock('@features/users/users.service')

describe('CategoriesController', () => {
  let controller: CategoriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, UsersService],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
