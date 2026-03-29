import { RequestHandler } from 'express';
import { z } from 'zod';
import userService from './users.service.js';
import { clinicIdSchema } from '../clinics/clinics.schema.js';
import { auth } from '../lib/auth.js';
import express from 'express';

const userIdSchema = z.object({
  id: z.string(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN', 'DOCTOR']).optional(),
  clinicId: z.string().optional().nullable(),
});

const get: RequestHandler = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await userService.get();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getById: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = userIdSchema.parse({ id });
    const user = await userService.getById(validated.id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid user ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const update: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = userIdSchema.parse({ id });
    const validatedBody = updateUserSchema.parse(req.body);
    const user = await userService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    return res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

const remove: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = userIdSchema.parse({ id });
    await userService.remove(validated.id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid user ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

const assignToClinic: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = userIdSchema.parse({ id });
    const validatedBody = clinicIdSchema.parse(req.body);
    const user = await userService.assignToClinic({
      userId: validatedParams.id,
      clinicId: validatedBody.id,
    });
    return res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to assign user to clinic' });
  }
};

const getCurrentUser: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // Get user email from better-auth session
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await userService.getByEmail(session.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
};

export default {
  get,
  getById,
  update,
  remove,
  assignToClinic,
  getCurrentUser,
};
