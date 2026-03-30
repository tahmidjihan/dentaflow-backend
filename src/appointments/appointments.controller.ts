import { RequestHandler } from 'express';
import { z } from 'zod';
import appointmentService from './appointments.service.js';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentIdSchema,
} from './appointments.schema.js';
import { AppointStatus } from '../generated/prisma/enums.js';
import { auth } from '../lib/auth.js';
import userService from '../users/users.service.js';
import express from 'express';

const get: RequestHandler = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const appointments = await appointmentService.get();
    return res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const getById: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
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
    console.error('Get appointment by id error:', error);
    return res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

const create: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const validated = createAppointmentSchema.safeParse(req.body);
    if (!validated.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validated.error });
    }
    const appointment = await appointmentService.create(validated.data);
    return res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    console.error('Create appointment error:', error);
    return res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const update: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = appointmentIdSchema.parse({ id });
    const validatedBody = updateAppointmentSchema.safeParse(req.body);
    if (!validatedBody.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validatedBody.error });
    }
    const appointment = await appointmentService.update({
      id: validatedParams.id,
      ...validatedBody.data,
    });
    return res.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    console.error('Update appointment error:', error);
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const updateStatus: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(AppointStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const validatedParams = appointmentIdSchema.parse({ id });
    const appointment = await appointmentService.updateStatus(
      validatedParams.id,
      status,
    );
    return res.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    console.error('Update appointment status error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update appointment status' });
  }
};

const getMyAppointments: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user by email
    const user = await userService.getByEmail(session.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get appointments for this user
    const appointments = await appointmentService.getByUserId(user.id);
    return res.json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

const getDoctorAppointments: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    // Get current user from session
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get current user to check role
    const currentUser = await userService.getByEmail(session.user.email);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only allow doctors to view their own appointments or admins to view all
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const validatedParams = appointmentIdSchema.parse({ id });
    const appointments = await appointmentService.getByDoctorId(
      validatedParams.id,
    );
    return res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid doctor ID', details: error });
    }
    return res
      .status(500)
      .json({ error: 'Failed to fetch doctor appointments' });
  }
};

const remove: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = appointmentIdSchema.parse({ id });

    // Get current user from session
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get current user to check ownership
    const currentUser = await userService.getByEmail(session.user.email);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get appointment to check ownership
    const appointment = await appointmentService.getById(validated.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Only allow appointment owner or admin to delete
    if (currentUser.role !== 'ADMIN' && appointment.userId !== currentUser.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await appointmentService.remove(validated.id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid appointment ID', details: error });
    }
    console.error('Delete appointment error:', error);
    return res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

export default {
  get,
  getById,
  create,
  update,
  updateStatus,
  getMyAppointments,
  getDoctorAppointments,
  remove,
};
