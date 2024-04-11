import express from 'express';

import { dbQuery } from '../utils/helper.js';

const searchRouter = express.Router();

searchRouter.post('/', async (req, res) => {
  console.log('body', req.body);
  const { search, town, category } = req.body;
  const dbParams: [string | number] = [`${search}%`];
  try {
    let sql = 'SELECT * from ads WHERE LOWER(title) LIKE LOWER(?)';

    if (town) {
      sql += ' AND town_id = ?';
      dbParams.push(town);
    }

    if (category) {
      sql += ' AND category_id = ?';
      dbParams.push(category);
    }

    sql += ' LIMIT 10';

    const [rows, err] = await dbQuery(sql, dbParams);
    if (err) {
      res.json({ message: 'somethink went wrong' });
      return;
    }
    res.json(rows);
  } catch {
    res.json({ message: 'somethink went wrong' });
  }
});

export default searchRouter;
