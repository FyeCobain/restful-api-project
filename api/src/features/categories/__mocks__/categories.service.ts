import { CategoryDocument } from '../schemas/category.schema'
import { categoriesStub } from './categories.stub'

export class CategoriesService {
  private categories: CategoryDocument[] = categoriesStub()
}
