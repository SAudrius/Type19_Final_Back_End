import express from 'express';

import { dbQuery } from '../helpers/index.js';

const userRouter = express.Router();

userRouter.get('/', async (_req, res) => {
  const dbParams = [0];
  const sql = 'SELECT * FROM USERS where is_deleted = ?';
  const [rows, err] = await dbQuery(sql, dbParams);
  console.log('rows ===', rows);
  console.log('err ===', err);
  res.json(rows);
});
userRouter.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const dbParams = [userId, 0];
  console.log('dbParams ===', dbParams);
  const sql = 'SELECT * FROM USERS WHERE id = ? AND is_deleted = ?';
  const [rows, err] = await dbQuery(sql, dbParams);
  console.log('rows ===', rows);
  console.log('err ===', err);
  res.json(rows);
});

export default userRouter;
