import { UserDocument } from '../schemas/user.schema'

export type UserDocumentPromise = Promise<UserDocument | undefined>

export type UserDocumentsArrayPromise = Promise<UserDocument[]>
