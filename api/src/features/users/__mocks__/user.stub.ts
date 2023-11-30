import { Types } from 'mongoose'
import { UserDocument } from '../schemas/user.schema'

const _id = new Types.ObjectId('6568c5913f310259e3eea786')
export const userStub = (): UserDocument => {
  return {
    _id,
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$QM4gzZdRm7ib6LVKu9oM7w$xL06ysBg+fh+PqOKpilR+zm7KL19f0aMZ9LvPIhbwhY',
    validatedAccount: false,
    accountType: 'admin',
    refreshToken:
      '$argon2id$v=19$m=65536,t=3,p=4$zOz5Sjk1cIicR7xCzZ4ZiA$C0o6JgY40za9Rix7GiDoFrzCdoquGTJRo5rmeSObSk0',
  } as UserDocument
}
