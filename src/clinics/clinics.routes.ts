import express from 'express';
import controller from './clinics.controller';
import { requireAuth, requireRole } from '../lib/authMiddleware';
import { Role } from '../generated/prisma';

const router = express.Router();

// Public routes
router.get('/', controller.get);
router.get('/:id', controller.getById);

// Protected routes - Admin only
router.post('/', requireAuth, requireRole(Role.ADMIN), controller.create);
router.put('/:id', requireAuth, requireRole(Role.ADMIN), controller.update);
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), controller.remove);

export default router;
