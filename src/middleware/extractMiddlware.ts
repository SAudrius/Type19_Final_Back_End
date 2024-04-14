import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../utils/constants.js';
import { sendJsonError } from '../utils/helper.js';

interface CustomRequest extends Request {
  userId?: number; // Define the userId property
  jwtToken?: string;
}

export const extractUserIdFromToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const BearerToken = req.headers.authorization;

  if (!BearerToken) {
    sendJsonError(res, 400, { message: 'token is not found' });
    return;
  }
  if (!SECRET_KEY) {
    sendJsonError(res, 400, { message: 'somethink went wrong' });
    return;
  }
  const token = BearerToken?.slice(7);

  try {
    if (!process.env.JWT_SECRET) {
      console.log('@no ENV');
      throw new Error('No jwt secret found');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtToken;
    const userId = decoded.user_id;

    req.body.user_id = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
