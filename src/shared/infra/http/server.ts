import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import rateLimiter from './middlewares/rateLimiter';

dotenv.config();

const app = express();

app.use(rateLimiter);
app.use(express.json());
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log(err.message);

  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV ? err.message : 'Internal Server Error',
  });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Backend server started on port ${port}!`);
});
