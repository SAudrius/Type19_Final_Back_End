import express from 'express';
import { ResultSetHeader } from 'mysql2';

import { dbQuery, sendJsonError, userIdByToken } from '../utils/helper.js';

const classifiedAdsRouter = express.Router();

classifiedAdsRouter.get('/', async (_req, res) => {
  const sql = 'SELECT * FROM ads WHERE is_published = 1 AND is_deleted = 0';
  const [rows, error] = await dbQuery<ClassifiedAd[]>(sql);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows);
});

classifiedAdsRouter.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const sql =
    'SELECT * FROM ads WHERE id = ? AND is_published = 1 AND is_deleted = 0';
  const dbParams = [userId];
  const [rows, error] = await dbQuery<ClassifiedAd[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  if (rows.length < 1) {
    sendJsonError(res, 404, { message: 'Do not exist' });
    return;
  }
  res.json(rows[0]);
});

classifiedAdsRouter.get('/town/:id', async (req, res) => {
  const townId = req.params.id;
  const sql =
    'SELECT * FROM ads WHERE town_id = ? AND is_published = 1 AND is_deleted = 0';
  const dbParams = [townId];
  const [rows, error] = await dbQuery<ClassifiedAd[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  if (rows.length < 1) {
    sendJsonError(res, 204, { message: 'No results found' });
    return;
  }
  res.json(rows);
});

classifiedAdsRouter.post('/user', async (req, res) => {
  const { token } = req.body;
  const userId = userIdByToken(token);
  if (!userId) {
    sendJsonError(res);
    return;
  }
  const sql =
    'SELECT * FROM ads WHERE user_id = ? AND is_published = 1 AND is_deleted = 0';
  const dbParams = [userId];
  const [rows, error] = await dbQuery<ClassifiedAd[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  if (rows.length < 1) {
    sendJsonError(res, 204, { message: 'No results found' });
    return;
  }
  res.json(rows);
});

classifiedAdsRouter.post('/', async (req, res) => {
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
    image_main,
    image_1,
    image_2,
    image_3,
    image_4,
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
    image_main,
    image_1,
    image_2,
    image_3,
    image_4,
  ];
  console.log('dbParams ===', dbParams);
  const sql =
    'INSERT INTO ads (title, main_image_url, description, price, phone, type, town_id, user_id, category_id, created_at, is_published) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json({ id: rows.insertId, ...req.body });
});

classifiedAdsRouter.delete('/:id', async (req, res) => {
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

export default classifiedAdsRouter;
