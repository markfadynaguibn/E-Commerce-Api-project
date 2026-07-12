const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(el => el.message).join(', ');
    error = new (require('../utils/AppError'))(message, 400);
  }

  if (err.name === 'CastError') {
    const message = `Invalid format for field ${err.path}: ${err.value}`;
    error = new (require('../utils/AppError'))(message, 400);
  }

  if (err.code === 11000) {
    const value = Object.keys(err.keyValue)[0];
    const message = `Duplicate value field: "${value}". Please choose another value.`;
    error = new (require('../utils/AppError'))(message, 409);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;