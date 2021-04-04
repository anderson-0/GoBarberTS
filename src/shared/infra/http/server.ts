import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';

import '@shared/infra/typeorm';
import '@shared/container';

import bodyParser from 'body-parser';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(routes);
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV ? err.message : 'Internal Server Error',
  });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Backend server started on port ${port}!`);
});
