import express from 'express';
import appointmentService from './appointments.service';

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
    const appointment = await appointmentService.getById(id as string);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, doctorId, clinicId, date, status } = req.body;
    const appointment = await appointmentService.create({
      userId,
      doctorId,
      clinicId,
      date,
      status,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const appointment = await appointmentService.update({ id, ...updateData });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

const remove = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await appointmentService.remove(id as string);
    res.status(204).send();
  } catch (error) {
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
