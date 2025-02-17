import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnv } from './utils/getEnv.js';
import { ENV_VARS } from './constants/env.js';
import router from './routes/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { UPLOADS_DIR_PATH } from './constants/path.js';

export const startServer = () => {
  const app = express();
  app.use(cors());
  app.use(cookieParser());

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/uploads', express.static(UPLOADS_DIR_PATH));

  app.use(router);

  app.use(errorHandlerMiddleware);

  const PORT = getEnv(ENV_VARS.PORT);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
