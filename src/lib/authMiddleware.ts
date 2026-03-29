import { auth } from './auth';
import { RequestHandler } from 'express';
import { Role } from '../generated/prisma/enums';
import { prisma } from './prisma';
import express from 'express';
export const requireAuth: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as any),
  });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      image: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  req.session = session.session;
  return next();
};

export const requireRole = (...roles: Role[]): RequestHandler => {
  return async (req: express.Request, res: express.Response, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Insufficient permissions' });
    }

    return next();
  };
};
