import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.errors,
    });
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate key error',
      error: { field: Object.keys(err.keyValue)[0], value: err.keyValue[Object.keys(err.keyValue)[0]] },
    });
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
};