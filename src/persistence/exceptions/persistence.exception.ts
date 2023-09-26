export class PersistenceException extends Error {
  constructor(
    message: string,
    readonly details?: Record<string, unknown> | Record<string, unknown>[]
  ) {
    super(message);
    this.name = 'PersistenceException';
  }
}
