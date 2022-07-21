function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      error: messages,
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
    });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
    });
  }
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not found',
    });
  }
  return res.status(500).json({
    error: err.message,
  });
}

export default errorHandler;
