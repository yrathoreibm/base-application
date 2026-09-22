import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';
import type { Request, Response, NextFunction } from 'express';

function makeRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('errorHandler', () => {
  it('should respond with 500 and generic message for unhandled error', () => {
    const err = new Error('boom');
    const res = makeRes();
    errorHandler(err, {} as Request, res, jest.fn() as unknown as NextFunction);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'An unexpected error occurred.', code: 500 },
    });
  });

  it('should use statusCode from error when present', () => {
    const err = Object.assign(new Error('not found'), { statusCode: 404 });
    const res = makeRes();
    errorHandler(err, {} as Request, res, jest.fn() as unknown as NextFunction);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'An unexpected error occurred.', code: 404 },
    });
  });

  it('should never expose the real error message to the client', () => {
    const err = new Error('SELECT * FROM users WHERE ...');
    const res = makeRes();
    errorHandler(err, {} as Request, res, jest.fn() as unknown as NextFunction);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(JSON.stringify(body)).not.toContain('SELECT');
  });
});

describe('notFoundHandler', () => {
  it('should respond with 404 and route not found message', () => {
    const res = makeRes();
    notFoundHandler({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Route not found.', code: 404 },
    });
  });
});

// Made with Bob
