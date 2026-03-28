import { auth } from './auth';
import express from 'express';
import { Role } from '../generated/prisma';

declare module 'express' {
  interface Request {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      emailVerified: boolean;
      image?: string;
    };
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
    };
  }
}

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
  req.session = session.session;
  return next();
};

export const requireRole = (...roles: Role[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    return next();
  };
};
