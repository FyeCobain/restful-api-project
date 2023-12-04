import { CategoryDocument } from '../schemas/category.schema'

export type CategoryPromise = Promise<CategoryDocument | undefined>

export type CategoryArrayPromise = Promise<CategoryDocument[]>
