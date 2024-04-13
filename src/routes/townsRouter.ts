import express from 'express';
import { ResultSetHeader } from 'mysql2';

import verifyToken from '../middleware/authMiddleware.js';
import { dbQuery, sendJsonError } from '../utils/helper.js';

const townsRouter = express.Router();

townsRouter.get('/', async (_req, res) => {
  const sql = 'SELECT * FROM towns WHERE is_deleted = 0';
  const [rows, error] = await dbQuery<Town[]>(sql);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows);
});

townsRouter.get('/:id', async (req, res) => {
  const townId = req.params.id;
  const sql = 'SELECT * FROM towns WHERE is_deleted = 0 AND id = ?';
  const dbParams = [townId];
  const [rows, error] = await dbQuery<Town[]>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json(rows[0]);
});

townsRouter.post('/', verifyToken, async (req, res) => {
  const { name, area, population } = req.body as Town;
  const dbParams = [name, area, population];
  const sql = 'INSERT INTO towns (name, population, area) VALUES (?,?,?)';
  const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  res.json({ id: rows.insertId, ...req.body });
});

townsRouter.delete('/:id', async (req, res) => {
  const townId = req.params.id;
  const sql = 'UPDATE towns SET is_deleted = 1 WHERE id = ?';
  const dbParams = [townId];
  const [rows, error] = await dbQuery<ResultSetHeader>(sql, dbParams);
  if (error) {
    sendJsonError(res);
    return;
  }
  if (rows.affectedRows < 1) {
    sendJsonError(res, 404, { message: 'town not found' });
  }
  res.sendStatus(200);
});

export default townsRouter;
