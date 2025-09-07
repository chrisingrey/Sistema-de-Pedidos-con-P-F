// Error para el código de estado HTTP 404 (Not Found).
export class NotFoundError extends Error {
  public status: number = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Error para el código de estado HTTP 409 (Conflict).
export class ConflictError extends Error {
  public status: number = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnAuthorizedError extends Error {
  public status: number = 401;
  constructor(message: string) {
    super(message);
    this.name = "UnAuthorizedError";
  }
}
