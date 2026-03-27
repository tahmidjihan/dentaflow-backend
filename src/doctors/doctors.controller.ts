import express from 'express';
import doctorService from './doctors.service';

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
    const doctor = await doctorService.getById(id as string);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

export default {
  get,
  getById,
};
