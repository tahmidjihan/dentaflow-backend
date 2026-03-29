import { z } from 'zod';
import { AppointStatus } from '../generated/prisma/enums.js';

export const createAppointmentSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  doctorId: z.string().min(1, 'doctorId is required'),
  clinicId: z.string().min(1, 'clinicId is required'),
  date: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  status: z.nativeEnum(AppointStatus).optional().default(AppointStatus.BOOKED),
});

export const updateAppointmentSchema = z.object({
  userId: z.string().min(1).optional(),
  doctorId: z.string().min(1).optional(),
  clinicId: z.string().min(1).optional(),
  date: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  status: z.nativeEnum(AppointStatus).optional(),
});

export const appointmentIdSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
