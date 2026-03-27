import express from 'express';

const get = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'this is GET appointments' });
};
const getById = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'this is GET appointment by ID' });
};
const create = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'this is POST appointments' });
};

const update = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'this is UPDATE appointments' });
};
const remove = (req: express.Request, res: express.Response) => {
  console.log(req);
  res.json({ message: 'this is DELETE appointments' });
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
