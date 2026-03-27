import express from 'express';
import clinicService from './clinics.service';

const get = async (_req: express.Request, res: express.Response) => {
  try {
    const clinics = await clinicService.get();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
};

const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const clinic = await clinicService.getById(id as string);
    if (clinic) {
      res.json(clinic);
    } else {
      res.status(404).json({ error: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinic' });
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const { name, location, phone, email } = req.body;
    const clinic = await clinicService.create({ name, location, phone, email });
    res.status(201).json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create clinic' });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const clinic = await clinicService.update({ id, ...updateData });
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update clinic' });
  }
};

const remove = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await clinicService.remove(id as string);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete clinic' });
  }
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
