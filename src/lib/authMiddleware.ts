import { auth } from './auth';
import express from 'express';

export const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = session.user;
  return next();
};
