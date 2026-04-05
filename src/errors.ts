export class OrlojError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrlojError";
  }
}

export class OrlojAPIError extends OrlojError {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "OrlojAPIError";
  }
}

export class BadRequestError extends OrlojAPIError {} // 400
export class AuthenticationError extends OrlojAPIError {} // 401
export class NotFoundError extends OrlojAPIError {} // 404
export class ConflictError extends OrlojAPIError {} // 409
export class RateLimitError extends OrlojAPIError {} // 429
export class InternalServerError extends OrlojAPIError {} // 500+
export class ServiceUnavailableError extends OrlojAPIError {} // 503

export class OrlojConnectionError extends OrlojError {} // fetch threw (network down)
export class OrlojTimeoutError extends OrlojError {} // AbortController timeout
export class OrlojStreamError extends OrlojError {} // SSE stream interrupted
