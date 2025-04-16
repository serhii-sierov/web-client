// Base class for all application errors
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// HTTP Error class for API-related errors
export class HttpError extends AppError {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// Validation Error class
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Authentication Error class
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

// Authorization Error class
export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

// Base Refresh Token Error class
export class RefreshTokenError extends AuthenticationError {
  constructor(message: string = 'Refresh token error') {
    super(message);
    this.name = 'RefreshTokenError';
    Object.setPrototypeOf(this, RefreshTokenError.prototype);
  }
}
