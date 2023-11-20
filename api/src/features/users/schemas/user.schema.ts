import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// Exporting the UserDocument type
export type UserDocument = HydratedDocument<User>

// User schema
@Schema()
export class User {
  // Name
  @Prop({
    required: true,
    trim: true,
  })
  name: string

  // Lastname
  @Prop({
    required: true,
    trim: true,
  })
  lastName: string

  // Email
  @Prop({
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string

  // Password
  @Prop({
    required: true,
  })
  password: string

  // Refresh token
  @Prop()
  refreshToken?: string

  // Validated account
  @Prop({
    default: false,
  })
  validatedAccount: boolean

  // Account type
  @Prop({
    enum: ['admin', 'finalUser'],
    default: 'admin',
  })
  accountType: string
}

// Exporting the User Schema
export const UserSchema = SchemaFactory.createForClass(User)
