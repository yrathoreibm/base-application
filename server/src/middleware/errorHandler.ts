import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;

  logger.error({ err, statusCode }, 'Unhandled error');

  res.status(statusCode).json({
    error: {
      message: 'An unexpected error occurred.',
      code: statusCode,
    },
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: 'Route not found.', code: 404 } });
}

// Made with Bob
