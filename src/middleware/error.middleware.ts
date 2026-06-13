import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/response.util.js';

export function asyncHandler<T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req as T, res, next).catch(next);
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  console.error('Unexpected error:', err);
  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, StatusCodes.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`);
}