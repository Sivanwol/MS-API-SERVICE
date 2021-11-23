export class EntityNotExistException extends Error {
  constructor(entityId: string) {
    super(`Entity Id (${entityId}) not found `)
  }
}
