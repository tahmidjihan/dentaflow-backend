import express from 'express';
import controller from './appointments.controller';
import { requireAuth } from '../lib/authMiddleware';
// import { Role } from '../generated/prisma/enums';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get current user's appointments (patient view)
router.get('/my', controller.getMyAppointments);

// Get doctor's appointments by doctor ID
router.get('/doctor/:id', controller.getDoctorAppointments);

// General routes
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/status', controller.updateStatus);
router.delete('/:id', controller.remove);

export default router;
