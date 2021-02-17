import AppError from '@src/errors/AppError';
import { de } from 'date-fns/locale';
import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT is missing in the header');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;
    req.user = {
      id: sub,
    };
    console.log(decoded);
    return next();
  } catch {
    throw new AppError('Invalid JWT Token');
  }
}
