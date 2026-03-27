import { z } from 'zod';

export const doctorIdSchema = z.object({
  id: z.string().min(1, 'Doctor ID is required'),
});

export type DoctorIdInput = z.infer<typeof doctorIdSchema>;
