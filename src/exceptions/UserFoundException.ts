export class UserFoundException extends Error {
  constructor(entityId: string) {
    super(`User Id (${entityId}) found `)
  }
}
