import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ResultSetHeader } from 'mysql2';

import {
  validateLogin,
  validateRegister,
} from '../middleware/validationMiddlware.js';
import { REFRESH_KEY, SECRET_KEY } from '../utils/constants.js';
import { dbQuery, sendJsonError } from '../utils/helper.js';

const authRouter = express.Router();

authRouter.post('/register', validateRegister, async (req, res) => {
  const { name, password, email, avatar_url: avatarUrl } = req.body as User;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'SELECT * WHERE email = ?';
    const dbParams = [email];
    const [rows, error] = await dbQuery<User[]>(sql, dbParams);

    if (error) {
      sendJsonError(res);
    }
    if (rows && rows.length > 0) {
      sendJsonError(res, 401);
    }

    const sql2 =
      'INSERT INTO users (name,password,email,avatar_url) VALUES (?,?,?,?) ';
    const dbParams2 = [name, hashedPassword, email, avatarUrl];
    const [rows2, error2] = await dbQuery<ResultSetHeader>(sql2, dbParams2);

    if (
      error2 ||
      typeof SECRET_KEY !== 'string' ||
      typeof REFRESH_KEY !== 'string'
    ) {
      throw new Error('server error');
    }

    const accessTokenExpires = Date.now() + 60 * 1000;
    const refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const jwtToken = jwt.sign(
      { user_id: rows2.insertId, exp: accessTokenExpires },
      SECRET_KEY
    );
    const refreshToken = jwt.sign(
      { user_id: rows2.insertId, exp: refreshTokenExpires },
      REFRESH_KEY
    );
    res.json({
      message: 'register success',
      token: jwtToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    sendJsonError(res);
    return;
  }
});

authRouter.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body as User;
  const dbParams = [email, 0];
  const sql = 'SELECT * FROM USERS WHERE email = ? AND is_deleted = ?';
  const [rows, error] = await dbQuery<User[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  if (rows.length < 1) {
    sendJsonError(res, 401);
    return;
  }
  const passwordValid = await bcrypt.compare(password, rows[0].password);
  if (!passwordValid) {
    sendJsonError(res, 401);
    return;
  }
  if (
    error ||
    typeof SECRET_KEY !== 'string' ||
    typeof REFRESH_KEY !== 'string'
  ) {
    sendJsonError(res);
    return;
  }

  const accessTokenExpires = Date.now() + 15 * 60 * 1000;
  const refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const jwtToken = jwt.sign(
    { user_id: rows[0].id, exp: accessTokenExpires },
    SECRET_KEY
  );
  const refreshToken = jwt.sign(
    { user_id: rows[0].id, exp: refreshTokenExpires },
    REFRESH_KEY
  );

  res.json({
    message: 'register success',
    token: jwtToken,
    refreshToken: refreshToken,
  });
});

authRouter.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    sendJsonError(res, 401, { message: 'no refresh token' });
    return;
  }
  try {
    if (typeof SECRET_KEY !== 'string' || typeof REFRESH_KEY !== 'string') {
      throw new Error('server error');
    }
    const accessTokenExpires = Date.now() + 15 * 60 * 1000;

    const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtDecodedToken;

    const jwtToken = jwt.sign(
      { user_id: decoded.user_id, exp: accessTokenExpires },
      SECRET_KEY
    );
    res.json({ message: 'Register success', token: jwtToken });
  } catch {
    sendJsonError(res, 400, { message: 'invalid refresh token' });
    return;
  }
});

export default authRouter;
