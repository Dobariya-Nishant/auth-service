export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message: string) {
    super(message, 405);
    this.name = "MethodNotAllowedError";
  }
}

export class NotAcceptableError extends AppError {
  constructor(message: string) {
    super(message, 406);
    this.name = "NotAcceptableError";
  }
}

export class ProxyAuthenticationRequiredError extends AppError {
  constructor(message: string) {
    super(message, 407);
    this.name = "ProxyAuthenticationRequiredError";
  }
}

export class RequestTimeoutError extends AppError {
  constructor(message: string) {
    super(message, 408);
    this.name = "RequestTimeoutError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class GoneError extends AppError {
  constructor(message: string) {
    super(message, 410);
    this.name = "GoneError";
  }
}

export class LengthRequiredError extends AppError {
  constructor(message: string) {
    super(message, 411);
    this.name = "LengthRequiredError";
  }
}

export class PreconditionFailedError extends AppError {
  constructor(message: string) {
    super(message, 412);
    this.name = "PreconditionFailedError";
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message: string) {
    super(message, 413);
    this.name = "PayloadTooLargeError";
  }
}

export class URITooLongError extends AppError {
  constructor(message: string) {
    super(message, 414);
    this.name = "URITooLongError";
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message: string) {
    super(message, 415);
    this.name = "UnsupportedMediaTypeError";
  }
}

export class RangeNotSatisfiableError extends AppError {
  constructor(message: string) {
    super(message, 416);
    this.name = "RangeNotSatisfiableError";
  }
}

export class ExpectationFailedError extends AppError {
  constructor(message: string) {
    super(message, 417);
    this.name = "ExpectationFailedError";
  }
}

export class TeapotError extends AppError {
  constructor(message: string) {
    super(message, 418);
    this.name = "TeapotError";
  }
}

export class MisdirectedRequestError extends AppError {
  constructor(message: string) {
    super(message, 421);
    this.name = "MisdirectedRequestError";
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, 422);
    this.name = "UnprocessableEntityError";
  }
}

export class LockedError extends AppError {
  constructor(message: string) {
    super(message, 423);
    this.name = "LockedError";
  }
}

export class FailedDependencyError extends AppError {
  constructor(message: string) {
    super(message, 424);
    this.name = "FailedDependencyError";
  }
}

export class UpgradeRequiredError extends AppError {
  constructor(message: string) {
    super(message, 426);
    this.name = "UpgradeRequiredError";
  }
}

export class PreconditionRequiredError extends AppError {
  constructor(message: string) {
    super(message, 428);
    this.name = "PreconditionRequiredError";
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, 429);
    this.name = "TooManyRequestsError";
  }
}

export class RequestHeaderFieldsTooLargeError extends AppError {
  constructor(message: string) {
    super(message, 431);
    this.name = "RequestHeaderFieldsTooLargeError";
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = "InternalServerError";
  }
}

export class NotImplementedError extends AppError {
  constructor(message: string) {
    super(message, 501);
    this.name = "NotImplementedError";
  }
}

export class BadGatewayError extends AppError {
  constructor(message: string) {
    super(message, 502);
    this.name = "BadGatewayError";
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message, 503);
    this.name = "ServiceUnavailableError";
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message: string) {
    super(message, 504);
    this.name = "GatewayTimeoutError";
  }
}

export class HTTPVersionNotSupportedError extends AppError {
  constructor(message: string) {
    super(message, 505);
    this.name = "HTTPVersionNotSupportedError";
  }
}

export class VariantAlsoNegotiatesError extends AppError {
  constructor(message: string) {
    super(message, 506);
    this.name = "VariantAlsoNegotiatesError";
  }
}

export class InsufficientStorageError extends AppError {
  constructor(message: string) {
    super(message, 507);
    this.name = "InsufficientStorageError";
  }
}

export class LoopDetectedError extends AppError {
  constructor(message: string) {
    super(message, 508);
    this.name = "LoopDetectedError";
  }
}

export class NotExtendedError extends AppError {
  constructor(message: string) {
    super(message, 510);
    this.name = "NotExtendedError";
  }
}
