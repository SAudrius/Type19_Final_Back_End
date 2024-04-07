import express from 'express';
import { ResultSetHeader } from 'mysql2';

import { dbQuery, sendJsonError } from '../utils/helper.js';

const adsRouter = express.Router();

adsRouter.get('/', async (_req, res) => {
  const sql = 'SELECT * FROM ads WHERE is_published = 1 AND is_deleted = 0';
  const [rows, error] = await dbQuery<Ads[]>(sql);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows);
});

adsRouter.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const sql =
    'SELECT * FROM ads WHERE id = ? AND is_published = 1 AND is_deleted = 0';
  const dbParams = [userId];
  const [rows, error] = await dbQuery<Ads[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  console.log('rows.length ===', rows.length);
  if (rows.length < 1) {
    sendJsonError(res, 404, { message: 'User does not have any ads' });
    return;
  }
  res.json(rows);
});

adsRouter.post('/', async (req, res) => {
  const {
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
    created_at,
    is_published,
  } = req.body;
  const dbParams = [
    title,
    main_image_url,
    description,
    price,
    phone,
    type,
    town_id,
    user_id,
    category_id,
    created_at,
    is_published,
  ];
  const sql =
    'INSERT INTO ads (title, main_image_url, description, price, phone, type, town_id, user_id, category_id, created_at, is_published) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json({ id: rows.insertId, ...req.body });
});

adsRouter.delete('/:id', async (req, res) => {
  const adId = req.params.id;
  const { user_id: userId } = req.body;
  const dbParams1 = [adId];
  const sql1 = 'SELECT * FROM ads WHERE id = ?';
  const [rows1, error1] = await dbQuery<UserId[]>(sql1, dbParams1);
  if (error1) {
    sendJsonError(res);
    return;
  }
  if (rows1.length < 1) {
    sendJsonError(res, 404, { message: 'ad not found' });
    return;
  }
  const adUserId = rows1[0].user_id;
  if (userId !== adUserId) {
    sendJsonError(res, 405, { message: 'can not delete other users ads' });
    return;
  }
  const sql = 'UPDATE ads SET is_deleted = 1 WHERE id = ?';
  const dbParams = [adId];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);

  if (error) {
    sendJsonError(res);
    return;
  }
  res.sendStatus(200);
});

export default adsRouter;
