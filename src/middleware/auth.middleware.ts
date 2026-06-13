import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.util.js';
import { AppError } from '../utils/AppError.js';

export function verifyTokenMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Authorization token is required', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    throw new AppError('Authorization token is required', StatusCodes.UNAUTHORIZED);
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
  }
}