import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        name: 'ValidationError',
        errors: err.errors
      }
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        name: 'ValidationError',
        errors: {
          [field]: {
            message: `${field} must be unique`,
            name: 'ValidatorError',
            properties: {
              message: `${field} must be unique`,
              type: 'unique',
              path: field,
              value: err.keyValue[field]
            },
            kind: 'unique',
            path: field,
            value: err.keyValue[field]
          }
        }
      }
    });
  }

  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message || err
  });
};