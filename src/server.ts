import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { PORT } from './config.js';
import userRouter from './routes/usersRouter.js';

const port = PORT || 5005;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
  res.json({ msg: 'server is running' });
});

app.use('/api/v1/users', userRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Path not found', path: req.url });
});

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});
