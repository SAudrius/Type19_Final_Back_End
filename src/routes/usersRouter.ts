import bcrypt from 'bcryptjs';
import express from 'express';

import verifyToken from '../middleware/authMiddleware.js';
import { extractUserIdFromToken } from '../middleware/extractMiddlware.js';
import { dbQuery, sendJsonError, userIdByToken } from '../utils/helper.js';

const usersRouter = express.Router();

usersRouter.post('/user', verifyToken, async (req, res) => {
  const { token } = req.body;
  const userId = userIdByToken(token);
  if (!userId) {
    sendJsonError(res);
    return;
  }
  const sql = 'SELECT `email` ,`name`,`avatar_url`  FROM users WHERE id = ?';
  const dbParams = [userId];
  const [rows, error] = await dbQuery<User[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows[0]);
});

usersRouter.put(
  '/user',
  extractUserIdFromToken,
  verifyToken,
  async (req, res) => {
    const { name, email, avatarUrl, password, user_id } = req.body;
    if (!user_id || !email || !avatarUrl) {
      sendJsonError(res);
      return;
    }
    const sql = 'SELECT * FROM USERS WHERE id = ? AND is_deleted = 0';
    const dbParams = [user_id];
    const [rows, error] = await dbQuery<User[]>(sql, dbParams);
    if (error) {
      sendJsonError(res);
      return;
    }
    const passwordValid = await bcrypt.compare(password, rows[0].password);
    if (!passwordValid) {
      sendJsonError(res, 401, { message: 'Password is invalid' });
      return;
    }
    const sql2 =
      'UPDATE users SET name = ?, email = ?, avatar_url = ? WHERE id = ?';
    const dbParams2 = [name, email, avatarUrl, user_id];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_rows, error2] = await dbQuery<User[]>(sql2, dbParams2);
    if (error2) {
      sendJsonError(res);
      return;
    }
    res.sendStatus(200);
  }
);

export default usersRouter;
