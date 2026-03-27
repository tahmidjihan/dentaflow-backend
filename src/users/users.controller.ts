import express from 'express';
import userService from './users.service';

const get = async (_req: express.Request, res: express.Response) => {
  try {
    const users = await userService.get();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id as string);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export default {
  get,
  getById,
};
