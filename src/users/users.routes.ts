import express from 'express';
import controller from './users.controller.js';
import { requireAuth, requireRole } from '../lib/authMiddleware.js';
import { Role } from '../generated/prisma/enums.js';

const router = express.Router();

// Public routes
router.get('/', controller.get);
router.get('/:id', controller.getById);

// Protected routes - Get current user
router.get('/me', requireAuth, controller.getCurrentUser);

// Protected routes - Admin only
router.put('/:id', requireAuth, requireRole(Role.ADMIN), controller.update);
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), controller.remove);
router.post(
  '/:id/clinic',
  requireAuth,
  requireRole(Role.ADMIN),
  controller.assignToClinic,
);

export default router;
