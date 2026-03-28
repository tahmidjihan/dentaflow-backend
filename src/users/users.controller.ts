import express from 'express';
import { z } from 'zod';
import userService from './users.service';
import { clinicIdSchema } from '../clinics/clinics.schema';

const userIdSchema = z.object({
  id: z.string(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN', 'DOCTOR']).optional(),
  clinicId: z.string().optional().nullable(),
});

const get = async (_req: express.Request, res: express.Response) => {
  try {
    const users = await userService.get();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validated = userIdSchema.parse({ id });
    const user = await userService.getById(validated.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid user ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validatedParams = userIdSchema.parse({ id });
    const validatedBody = updateUserSchema.parse(req.body);
    const user = await userService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const remove = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validated = userIdSchema.parse({ id });
    await userService.remove(validated.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid user ID', details: error });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const assignToClinic = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validatedParams = userIdSchema.parse({ id });
    const validatedBody = clinicIdSchema.parse(req.body);
    const user = await userService.assignToClinic({
      userId: validatedParams.id,
      clinicId: validatedBody.clinicId,
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to assign user to clinic' });
  }
};

export default {
  get,
  getById,
  update,
  remove,
  assignToClinic,
};
