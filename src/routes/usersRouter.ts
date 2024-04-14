import express from 'express';

import verifyToken from '../middleware/authMiddleware.js';
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

export default usersRouter;
