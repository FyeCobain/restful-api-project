import { CategoryDocument } from '../schemas/category.schema'

export const categoriesStub = (): CategoryDocument[] => {
  const categories: CategoryDocument[] = [
    {
      _id: '656f817b9e250d119478916e',
      name: 'Frontend',
      description: 'Tickets related to frontend development',
    },
    {
      _id: '656f818c9e250d1194789171',
      name: 'Houseworking',
    },
    {
      _id: '656f81ac9e250d1194789174',
      name: 'Backend',
      description: 'Tickets related to backend development',
    },
    {
      _id: '656f81c19e250d1194789177',
      name: 'Learning',
      description: 'Study and new skills learning',
    },
    {
      _id: '656f81d39e250d119478917a',
      name: 'Healthcare',
    },
    {
      _id: null, // <-- To implicity convert all the id's to type mongoose.Types.ObjectId
    },
  ] as CategoryDocument[]
  categories.pop()
  return categories
}
