import express from 'express';

import { dbQuery, sendJsonError } from '../helpers/index.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req, res) => {
  const sql = 'SELECT * FROM categories';
  const [rows, error] = await dbQuery<Category>(sql);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows);
});

export default categoriesRouter;
