import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../utils/constants.js';
import { sendJsonError } from '../utils/helper.js';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, SECRET_KEY) as JwtDecodedToken;
    const today = Date.now();
    if (today > decoded.exp) {
      console.log('expires');
      throw new Error('token is expired');
    }
    console.log('not expired');
  } catch {
    // err
    sendJsonError(res, 401, { message: '' });
    sendJsonError(res, 400, { message: 'token is expired' });
    return;
  }

  next();
};

export default verifyToken;