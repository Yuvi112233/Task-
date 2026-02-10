import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('[BACKEND] Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[BACKEND] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
}
