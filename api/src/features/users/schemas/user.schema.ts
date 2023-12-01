import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// Exporting the UserDocument type
export type UserDocument = HydratedDocument<User>

// Creation of the User schema
@Schema()
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string

  @Prop({
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string

  @Prop({
    required: true,
  })
  password: string

  @Prop()
  refreshToken?: string

  @Prop({
    default: false,
  })
  validatedAccount: boolean

  @Prop({
    enum: ['admin', 'finalUser'],
    default: 'admin',
  })
  accountType: string
}

// Exporting the User Schema
export const UserSchema = SchemaFactory.createForClass(User)
