const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log internal server errors securely
  console.error(`[Error] ${req.method} ${req.url} : ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
};

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Resource Not Found: ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFound };
