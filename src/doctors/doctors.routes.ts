import express from 'express';
import controller from './doctors.controller';
import { requireAuth, requireRole } from '../lib/authMiddleware';
import { Role } from '../generated/prisma';

const router = express.Router();

// Public routes
router.get('/', controller.get);
router.get('/:id', controller.getById);

// Protected routes - Admin only
router.put('/:id', requireAuth, requireRole(Role.ADMIN), controller.update);
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), controller.remove);
router.post('/:id/clinic', requireAuth, requireRole(Role.ADMIN), controller.assignToClinic);

export default router;
