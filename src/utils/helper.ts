import { Response } from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

import { dbConfigRemote } from '../config.js';

type QueryRes<T> = [T, null] | [null, Error];

export const dbQuery = async <T>(
  sql: string,
  valuesArr: (string | number | boolean | Type)[] = []
): Promise<QueryRes<T>> => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfigRemote);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [res, _fields] = await conn.execute(sql, valuesArr);
    console.log('res ===', res);
    return [res as T, null];
  } catch (err) {
    console.log('err ===', err);
    return [null, err as Error];
  } finally {
    if (conn) conn.end();
  }
};

export const sendJsonError = (
  res: Response,
  code?: number | null,
  msgObj?: object
) => {
  let statusCode = 400;
  let resObj = {};
  if (msgObj && Object.values(msgObj).length > 0) {
    resObj = msgObj;
  } else {
    resObj = { message: 'somethink went wrong' };
  }
  if (code !== null && typeof code === 'number') {
    statusCode = code;
  }
  return res.status(statusCode).json(resObj);
};

export const userIdByToken = (token: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtToken;

    const userId = decoded.user_id;

    return userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
