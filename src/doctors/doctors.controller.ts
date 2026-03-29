import { RequestHandler } from 'express';
import { z } from 'zod';
import doctorService from './doctors.service';
import { doctorIdSchema } from './doctors.schema';
import { clinicIdSchema } from '../clinics/clinics.schema';
import express from 'express';

const updateDoctorSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  clinicId: z.string().optional().nullable(),
});

const get: RequestHandler = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const doctors = await doctorService.get();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

const getById: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = doctorIdSchema.parse({ id });
    const doctor = await doctorService.getById(validated.id);
    if (doctor) {
      return res.json(doctor);
    } else {
      return res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid doctor ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

const update: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = doctorIdSchema.parse({ id });
    const validatedBody = updateDoctorSchema.parse(req.body);
    const doctor = await doctorService.update({
      id: validatedParams.id,
      ...validatedBody,
    });
    return res.json(doctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to update doctor' });
  }
};

const remove: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validated = doctorIdSchema.parse({ id });
    await doctorService.remove(validated.id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid doctor ID', details: error });
    }
    return res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

const assignToClinic: RequestHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const validatedParams = doctorIdSchema.parse({ id });
    const validatedBody = clinicIdSchema.parse(req.body);
    const doctor = await doctorService.assignToClinic({
      doctorId: validatedParams.id,
      clinicId: validatedBody.id,
    });
    return res.json(doctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    return res.status(500).json({ error: 'Failed to assign doctor to clinic' });
  }
};

export default {
  get,
  getById,
  update,
  remove,
  assignToClinic,
};
