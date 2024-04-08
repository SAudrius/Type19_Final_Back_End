import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ResultSetHeader } from 'mysql2';

import { REFRESH_KEY, SECRET_KEY } from '../utils/constants.js';
import { dbQuery, sendJsonError } from '../utils/helper.js';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  const { name, password, email, avatar_url: avatarUrl } = req.body as User;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      'INSERT INTO users (name,password,email,avatar_url) VALUES (?,?,?,?) ';
    const dbParams = [name, hashedPassword, email, avatarUrl];
    const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);

    if (
      error ||
      typeof SECRET_KEY !== 'string' ||
      typeof REFRESH_KEY !== 'string'
    ) {
      throw new Error('server error');
    }

    const accessTokenExpires = Date.now() + 60 * 1000;
    const refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const jwtToken = jwt.sign(
      { user_id: rows.insertId, exp: accessTokenExpires },
      SECRET_KEY
    );
    const refreshToken = jwt.sign(
      { user_id: rows.insertId, exp: refreshTokenExpires },
      REFRESH_KEY
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.setHeader('Authorization', `Bearer ${jwtToken}`);
  } catch (err) {
    sendJsonError(res);
    return;
  }
  res.json({ message: 'register success' });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as User;
  const dbParams = [email, 0];
  const sql = 'SELECT * FROM USERS WHERE email = ? AND is_deleted = ?';
  const [rows, error] = await dbQuery<User[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  const passwordValid = await bcrypt.compare(password, rows[0].password);
  if (!passwordValid) {
    sendJsonError(res);
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

  const accessTokenExpires = Date.now() + 60 * 1000;
  const refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const jwtToken = jwt.sign(
    { user_id: rows[0].id, exp: accessTokenExpires },
    SECRET_KEY
  );
  const refreshToken = jwt.sign(
    { user_id: rows[0].id, exp: refreshTokenExpires },
    REFRESH_KEY
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.setHeader('Authorization', `Bearer ${jwtToken}`);

  res.json({ message: 'login success' });
});

authRouter.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    sendJsonError(res, 401, { message: 'no refresh token' });
    return;
  }
  try {
    if (typeof SECRET_KEY !== 'string' || typeof REFRESH_KEY !== 'string') {
      throw new Error('server error');
    }
    const accessTokenExpires = Date.now() + 60 * 1000;

    const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtDecodedToken;

    const jwtToken = jwt.sign(
      { user_id: decoded.user_id, exp: accessTokenExpires },
      SECRET_KEY
    );
    res.setHeader('Authorization', `Bearer ${jwtToken}`);
  } catch {
    sendJsonError(res, 400, { message: 'invalid refresh token' });
    return;
  }

  res.json({ message: 'Register success' });
});

export default authRouter;
