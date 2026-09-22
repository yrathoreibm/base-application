import { requestLogger } from '../../middleware/requestLogger';
import type { Request, Response, NextFunction } from 'express';

// Silence logger output during tests
jest.mock('../../utils/logger', () => ({
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
  __esModule: true,
}));

import logger from '../../utils/logger';
const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('requestLogger', () => {
  it('should call next()', () => {
    const next = jest.fn() as unknown as NextFunction;
    const req = { method: 'GET', url: '/health', ip: '127.0.0.1' } as Request;
    requestLogger(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should log method, url, and ip', () => {
    const next = jest.fn() as unknown as NextFunction;
    const req = { method: 'POST', url: '/graphql', ip: '127.0.0.1' } as Request;
    requestLogger(req, {} as Response, next);
    expect(mockedLogger.info).toHaveBeenCalledWith(
      { method: 'POST', url: '/graphql', ip: '127.0.0.1' },
      'Incoming request'
    );
  });
});

// Made with Bob
