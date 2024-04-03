import express from 'express';
import { ResultSetHeader } from 'mysql2';

import { dbQuery } from '../helpers/index.js';

const adsRouter = express.Router();

adsRouter.get('/', async (_req, res) => {
  const sql = 'SELECT * FROM ads WHERE is_published = 1 is_deleted = 0';
  const [rows, error] = await dbQuery<Ads[]>(sql);
  if (error) {
    res.status(400).json({ message: 'Somethink went wrong' });
    console.log('error ===', error);
    return;
  }
  res.json(rows);
});

adsRouter.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const sql =
    'SELECT * FROM ads WHERE id = ? AND is_published = 1 is_deleted = 0';
  const dbParams = [userId];
  const [rows, error] = await dbQuery<Ads[]>(sql, dbParams);
  if (error) {
    res.status(400).json({ message: 'Somethink went wrong' });
    console.log('error ===', error);
    return;
  }
  if (rows.length < 1) {
    res.status(204).json({ message: 'User does not have any ads' });
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
    res.status(400).json({ message: 'somethink went wrong' });
    return;
  }
  res.json({ id: rows.insertId, ...req.body });
});

adsRouter.delete('/:id', async (req, res) => {
  const adId = req.params.id;
  const sql = 'UPDATE ads SET is_deleted = 1 WHERE id = ?';
  const dbParams = [adId];
  const [rows, error] = await dbQuery<Ads[]>(sql, dbParams);
  if (error) {
    res.status(400).json({ message: 'somethink went wrong' });
    return;
  }
  res.json(rows);
});

export default adsRouter;
