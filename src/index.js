import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { ENV_VARS } from './constants/env.js';

const app = express();
app.use(cors());
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.get('/hello', (req, res, next) => {
  return res.send('Hello world');
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello world1' });
});

app.use('/hello', (err, req, res, next) => {
  res.send(err.message);
});

const PORT = getEnv(ENV_VARS.PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
