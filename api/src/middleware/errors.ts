import { ErrorRequestHandler } from 'express';
import { pick } from 'lodash';
import { CustomError } from 'errors';
import mongoose from 'mongoose';

export const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Error details:', error);

  if (error instanceof mongoose.Error.ValidationError) {
    const validationErrors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        data: { validationErrors }
      }
    });
  }

  const isErrorSafeForClient = error instanceof CustomError;

  const clientError = isErrorSafeForClient
    ? pick(error, ['message', 'code', 'status', 'data'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: { error: error.message }
      };

  res.status(clientError.status).send({ error: clientError });
};
