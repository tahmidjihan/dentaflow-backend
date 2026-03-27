import express from 'express';
import { z } from 'zod';
import appointmentService from './appointments.service';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentIdSchema,
} from './appointments.schema';

const get = async (_req: express.Request, res: express.Response) => {
  try {
    const appointments = await appointmentService.get();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validated = appointmentIdSchema.parse({ id });
    const appointment = await appointmentService.getById(validated.id);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const validated = createAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.create(validated);
    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validatedParams = appointmentIdSchema.parse({ id });
    const validatedBody = updateAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    res.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const remove = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validated = appointmentIdSchema.parse({ id });
    await appointmentService.remove(validated.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
