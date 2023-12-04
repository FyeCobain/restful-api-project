import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// Exporting the CategoryDocument type
export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
  @Prop({
    required: true,
    unique: true,
  })
  name: string

  @Prop({
    required: false,
  })
  description?: string
}

// Exporting the Category schema
export const CategorySchema = SchemaFactory.createForClass(Category)
