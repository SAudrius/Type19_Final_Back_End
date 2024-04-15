import { NextFunction, Request, Response } from 'express';

import { sendJsonError } from '../utils/helper.js';
import {
  loginSchema,
  postClassifiedAdSchema,
  registerSchema,
} from '../utils/schemas.js';

export const validatePostClassifiedAd = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = postClassifiedAdSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    sendJsonError(res, 400, { message: 'Validation error' });
    return;
  }
  next();
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    sendJsonError(res, 400, {
      message: 'Validation error',
    });
    return;
  }
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    sendJsonError(res, 400, {
      message: 'Validation error',
    });
    return;
  }
  next();
};
