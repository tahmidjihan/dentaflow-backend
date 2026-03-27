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

export default {
  get,
};
