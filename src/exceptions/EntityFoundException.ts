export class EntityFoundException extends Error {
  constructor(entityId: string) {
    super(`Entity Id (${entityId}) found `)
  }
}
