import express, { type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import clinicsRouter from './clinics/clinics.routes.js';
import appointmentsRouter from './appointments/appointments.routes.js';
import doctorsRouter from './doctors/doctors.routes.js';
import usersRouter from './users/users.routes.js';
import paymentsRouter from './payments/payments.routes.js';
import chatRouter from './chat/chat.routes.js';
import Stripe from 'stripe';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
  process.env.ORIGIN_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean) as string[]; // Remove undefined values

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      console.log(`[CORS] Origin: ${origin}, Allowed: ${isAllowed}`);

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
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (MUST be before auth catch-all)
app.use('/api/clinics', clinicsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/chat', chatRouter);

// Auth middleware - use wildcard pattern for Express v5 compatibility
app.all('/api/auth/*splat', toNodeHandler(auth));
// app.use('/api/auth', toNodeHandler(auth));

// 404 handler
app.use((_req: Request, res: Response) => {
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

// In serverless environments (e.g. Vercel/AWS Lambda), the platform manages the HTTP server.
const isServerless =
  process.env.VERCEL === '1' ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.LAMBDA_TASK_ROOT);

if (!isServerless) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
