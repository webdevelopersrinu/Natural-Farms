class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode >= 400 && statusCode < 500 ? "Fail" : "Error";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
