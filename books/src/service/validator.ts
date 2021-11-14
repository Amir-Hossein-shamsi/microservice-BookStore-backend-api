import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '@aroona/commonhandeller';

export const create_book_validator = [
  body('title').notEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must begrater than 0'),
  body('author').notEmpty().withMessage('author can not be empty'),
  body('rank')
    .isFloat({ gt: 0, lt: 5 })
    .withMessage('The rank can not be less than 0 and more than 5'),
];

export const update_book_validator = [
  body('title').notEmpty().withMessage('title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must begrater than 0'),
  body('author').notEmpty().withMessage('author can not be empty'),
  body('rank')
    .isFloat({ gt: 0, lt: 5 })
    .withMessage('The rank can not be less than 0 and more than 5'),
];

export const validatorChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
