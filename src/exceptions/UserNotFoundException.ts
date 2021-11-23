export class UserNotFoundException extends Error {
  constructor(entityId: string) {
    super(`User Id (${entityId}) not found `)
  }
}
