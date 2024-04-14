import { NextFunction, Request, Response } from 'express';

import { sendJsonError } from '../utils/helper.js';
import { postClassifiedAdSchema } from '../utils/schemas.js';

export const validatePostClassifiedAd = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = postClassifiedAdSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    sendJsonError(res, 400, { message: 'somethink went wrong' });
    console.log(error.details);
    return;
  }
  next();
};
