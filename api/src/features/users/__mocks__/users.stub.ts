import { UserDocument } from '../schemas/user.schema'

export const usersStub = (): UserDocument[] => {
  const users: UserDocument[] = [
    {
      _id: '6568cc5dada867684ee6a5b6',
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$QM4gzZdRm7ib6LVKu9oM7w$xL06ysBg+fh+PqOKpilR+zm7KL19f0aMZ9LvPIhbwhY',
      validatedAccount: false,
      accountType: 'admin',
      refreshToken:
        '$argon2id$v=19$m=65536,t=3,p=4$zOz5Sjk1cIicR7xCzZ4ZiA$C0o6JgY40za9Rix7GiDoFrzCdoquGTJRo5rmeSObSk0',
    },
    {
      _id: '656963130aafdd90a149b079',
      name: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$QM4gzZdRm7ib6LVKu9oM7w$xL06ysBg+fh+PqOKpilR+zm7KL19f0aMZ9LvPIhbwhY',
      validatedAccount: false,
      accountType: 'admin',
      refreshToken: null,
    },
    {
      _id: null, // <-- Dummy object to implicity convert all the id's to type mongoose.Types.ObjectId
    },
  ] as UserDocument[]
  // Removing dummy object before returning users
  users.pop()
  return users
}
