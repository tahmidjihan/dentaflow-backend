import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import clinicsRouter from './clinics/clinics.routes';
import appointmentsRouter from './appointments/appointments.routes';
import doctorsRouter from './doctors/doctors.routes';
import usersRouter from './users/users.routes';
import paymentsRouter from './payments/payments.routes';
import Stripe from 'stripe';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (MUST be before auth catch-all)
app.use('/api/clinics', clinicsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/payments', paymentsRouter);

// Webhook route needs raw body
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      const paymentService = await import('./payments/payments.service');
      await paymentService.handleWebhookEvent(event);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook error' });
    }
  },
);

// Auth middleware - specific path, not catch-all
app.use('/api/auth', toNodeHandler(auth));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
