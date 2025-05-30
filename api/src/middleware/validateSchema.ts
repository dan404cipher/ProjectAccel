import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors';

export const validateSchema = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
      throw new ValidationError(errorMessage);
    }

    next();
  };
}; 