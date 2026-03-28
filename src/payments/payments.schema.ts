import { z } from 'zod';

export const createPaymentSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  amount: z.number().positive('Amount must be a positive number'),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
