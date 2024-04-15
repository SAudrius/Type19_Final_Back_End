import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { PORT } from './config.js';
import authRouter from './routes/authRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import classifiedAdsRouter from './routes/classifiedAdsRouter.js';
import searchRouter from './routes/searchRouter.js';
import townsRouter from './routes/townsRouter.js';
import usersRouter from './routes/usersRouter.js';

const port = PORT || 5005;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/classified-ads', classifiedAdsRouter);
app.use('/api/v1/towns', townsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/users', usersRouter);

app.get('/', (_req, res) => {
  res.json({ msg: 'server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url });
});

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});
