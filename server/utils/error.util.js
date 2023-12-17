class AppError extends Error {
  constructor(message, StatusCode) {
    super(message);

    this.StatusCode = StatusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
