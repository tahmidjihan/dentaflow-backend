import express from 'express';
import { z } from 'zod';
import doctorService from './doctors.service';
import { doctorIdSchema } from './doctors.schema';

const get = async (_req: express.Request, res: express.Response) => {
  try {
    const doctors = await doctorService.get();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const validated = doctorIdSchema.parse({ id });
    const doctor = await doctorService.getById(validated.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid doctor ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

export default {
  get,
  getById,
};
