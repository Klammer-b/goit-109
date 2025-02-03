import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      name: err.name,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: err.message,
      name: 'Mongoose error',
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      errors: err.details.map((err) => ({
        message: err.message,
        path: err.path,
      })),
      name: 'Validation error',
    });
  }

  res.status(500).json({
    status: 500,
    message: err.message,
    name: 'Internal server error',
  });
};
