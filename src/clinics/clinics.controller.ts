import { RequestHandler } from 'express';
import { z } from 'zod';
import clinicService from './clinics.service';
import {
  createClinicSchema,
  updateClinicSchema,
  clinicIdSchema,
} from './clinics.schema';
import express from 'express';
const get: RequestHandler = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const clinics = await clinicService.get();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinics' });
    return;
  }
};

const getById: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = clinicIdSchema.parse({ id });
    const clinic = await clinicService.getById(validated.id);
    if (clinic) {
      res.json(clinic);
      return;
    } else {
      res.status(404).json({ error: 'Clinic not found' });
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid clinic ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch clinic' });
    return;
  }
};

const create: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const validated = createClinicSchema.parse(req.body);
    const clinic = await clinicService.create(validated);
    res.status(201).json(clinic);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to create clinic' });
    return;
  }
};

const update: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = clinicIdSchema.parse({ id });
    const validatedBody = updateClinicSchema.parse(req.body);
    const clinic = await clinicService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    res.json(clinic);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to update clinic' });
    return;
  }
};

const remove: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = clinicIdSchema.parse({ id });
    await clinicService.remove(validated.id);
    res.status(204).send();
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid clinic ID', details: error });
    }
    res.status(500).json({ error: 'Failed to delete clinic' });
    return;
  }
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
