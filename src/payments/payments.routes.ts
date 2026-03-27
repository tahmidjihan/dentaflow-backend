import express from 'express';
import controller from './payments.controller';
import { requireAuth } from '../lib/authMiddleware';

const router = express.Router();

// All payment routes require authentication
router.use(requireAuth);

router.post('/create-checkout-session', controller.createCheckout);
router.get('/', controller.getAllPayments);
router.get('/:id', controller.getPaymentById);
router.get('/session/lookup', controller.getPaymentBySession);

// Webhook route (needs raw body, handled separately)
router.post('/webhook', controller.handleWebhook);

export default router;
