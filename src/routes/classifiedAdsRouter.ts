import express from 'express';
import { ResultSetHeader } from 'mysql2';

import verifyToken from '../middleware/authMiddleware.js';
import { extractUserIdFromToken } from '../middleware/extractMiddlware.js';
import { validatePostClassifiedAd } from '../middleware/validationMiddlware.js';
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

classifiedAdsRouter.post('/user', verifyToken, async (req, res) => {
  const { token } = req.body;

  const userId = userIdByToken(token);

  if (!userId) {
    sendJsonError(res);
    return;
  }
  const sql = 'SELECT * FROM ads WHERE user_id = ? AND is_deleted = 0';
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

classifiedAdsRouter.patch('/public/:id', verifyToken, async (req, res) => {
  const { token } = req.body;
  const id = req.params.id;

  const userId = userIdByToken(token);

  if (!userId) {
    sendJsonError(res);
    return;
  }
  const sql =
    'UPDATE ads SET is_published = NOT is_published WHERE id = ? AND user_id = ?';
  const dbParams = [id, userId];
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

classifiedAdsRouter.post(
  '/',
  extractUserIdFromToken,
  validatePostClassifiedAd,
  async (req, res) => {
    const {
      title,
      image_main,
      description,
      price,
      phone,
      type,
      town: town_id,
      user_id,
      category: category_id,
      isPublished: is_published,
      image_1,
      image_2,
      image_3,
      image_4,
    } = req.body;

    const dbParams = [
      title,
      description,
      price,
      phone,
      type,
      parseInt(town_id),
      parseInt(user_id),
      parseInt(category_id),
      image_main,
      image_1,
      image_2,
      image_3,
      image_4,
      parseInt(is_published),
    ];
    // is_published
    const sql =
      'INSERT INTO ads (title, description, price, phone, `type`, town_id, user_id, category_id, image_main, image_1, image_2, image_3, image_4,is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);

    if (error) {
      sendJsonError(res);
      return;
    }
    res.json({ id: rows.insertId, ...req.body });
  }
);

classifiedAdsRouter.delete('/:id', extractUserIdFromToken, async (req, res) => {
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
    sendJsonError(res, 404, { message: 'Not found' });
    return;
  }
  const adUserId = rows1[0].user_id;
  if (userId !== adUserId) {
    sendJsonError(res, 405, { message: 'Can not delete other users ads' });
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
