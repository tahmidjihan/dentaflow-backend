import { prisma } from '../lib/prisma';
import type { DoctorIdInput } from './doctors.schema';

const get = () => {
  const doctors = prisma.user.findMany({
    where: {
      role: 'DOCTOR',
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      clinicId: true,
    },
  });
  return doctors;
};

const getById = (id: string) => {
  const doctor = prisma.user.findFirst({
    where: {
      id: id,
      role: 'DOCTOR',
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      clinicId: true,
    },
  });
  return doctor;
};

export default {
  get,
  getById,
};
