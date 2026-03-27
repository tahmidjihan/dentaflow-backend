import { z } from 'zod';

export const createClinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
});

export const updateClinicSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  status: z.string().optional(),
});

export const clinicIdSchema = z.object({
  id: z.string().min(1, 'Clinic ID is required'),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;
