import express from 'express';
import controller from './appointments.controller';
import { requireAuth } from '../lib/authMiddleware';
const router = express.Router();

router.use(requireAuth);

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
