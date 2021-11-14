import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '@aroona/commonhandeller';

export const signup_validator = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage('password must be more than 4 and less than 30'),
];

export const signin_validator = [
  body('email').notEmpty().isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage('password must be more than 4 and less than 30'),
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
