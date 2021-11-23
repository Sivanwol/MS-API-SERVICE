export class AuthorizationError extends Error {

  constructor(message: string) {
    super(`Authorization Error (${message})`)
  }
}
