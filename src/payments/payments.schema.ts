import { z } from 'zod';

export const createPaymentSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  amount: z.number().int().positive('Amount must be a positive integer'),
  currency: z.string().min(1, 'Currency is required').default('usd'),
});

export const paymentIdSchema = z.object({
  id: z.string().min(1, 'Payment ID is required'),
});

export const sessionIdSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type PaymentIdInput = z.infer<typeof paymentIdSchema>;
export type SessionIdInput = z.infer<typeof sessionIdSchema>;
