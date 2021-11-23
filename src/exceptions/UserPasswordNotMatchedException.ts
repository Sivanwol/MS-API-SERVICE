export class UserPasswordNotMatchedException extends Error {
  constructor(entityId: string) {
    super(`User Id (${entityId}) found but password not matched `)
  }
}
