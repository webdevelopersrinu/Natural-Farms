function devError(res, err) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    err,
  });
}

function proError(res, err) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

// ValidationErrorHandeler
function ValidationErrorHandeler(err) {
  return new CustomError(err.message, 400);
}

// DuplicateKeyError
function DuplicateKeyError(err) {
  return new CustomError(
    `The email '${err.keyValue.email}' is already registered `,
    409
  );
}

// JsonWebTokenErrorHandeler
function JsonWebTokenErrorHandeler(err) {
  return new CustomError(err.message, 401);
}

function globalErrorHandler(err, req, res, next) {
  err.status = err.status || "Error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  }
  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") {
      err = ValidationErrorHandeler(err);
    }
    if (err.code === 11000) {
      err = DuplicateKeyError(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = JsonWebTokenErrorHandeler(err);
    }
    proError(res, err);
  }
}

export default globalErrorHandler;
