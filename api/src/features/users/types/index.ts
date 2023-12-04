import { UserDocument } from '../schemas/user.schema'

export type UserPromise = Promise<UserDocument | undefined>

export type UserArrayPromise = Promise<UserDocument[]>
