import express from 'express';

const get = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'List all clinics' });
};
const getById = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'Get clinic by ID' });
};
const create = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'Create a new clinic' });
};

const update = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'Update a clinic' });
};
const remove = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'Delete a clinic' });
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
