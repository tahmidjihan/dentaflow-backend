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
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
  process.env.ORIGIN_URL || 'http://localhost:3000',
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
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

// Auth middleware - specific path, not catch-all
app.use('/api/auth', toNodeHandler(auth));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// app.use(
//   (
//     err: Error,
//     _req: express.Request,
//     res: express.Response,
//     _next: express.NextFunction,
//   ) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Internal server error' });
//   },
// );

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
