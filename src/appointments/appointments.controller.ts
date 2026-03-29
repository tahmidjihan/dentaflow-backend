import { RequestHandler } from 'express';
import { z } from 'zod';
import appointmentService from './appointments.service';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentIdSchema,
} from './appointments.schema';

const get: RequestHandler = async (_req, res) => {
  try {
    const appointments = await appointmentService.get();
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validated = appointmentIdSchema.parse({ id });
    const appointment = await appointmentService.getById(validated.id);
    if (appointment) {
      return res.json(appointment);
    } else {
      return res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

const create: RequestHandler = async (req, res) => {
  try {
    const validated = createAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.create(validated);
    return res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedParams = appointmentIdSchema.parse({ id });
    const validatedBody = updateAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    return res.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const validated = appointmentIdSchema.parse({ id });
    await appointmentService.remove(validated.id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
