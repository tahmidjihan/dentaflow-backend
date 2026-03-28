import { prisma } from '../lib/prisma';

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
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
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
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return doctor;
};

const update = async (data: {
  id: string;
  name?: string;
  email?: string;
  clinicId?: string | null;
}) => {
  const doctor = await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
      clinicId: data.clinicId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      clinicId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return doctor;
};

const remove = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
};

const assignToClinic = async (data: { doctorId: string; clinicId: string }) => {
  const doctor = await prisma.user.update({
    where: { id: data.doctorId },
    data: { clinicId: data.clinicId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clinicId: true,
    },
  });
  return doctor;
};

export default {
  get,
  getById,
  update,
  remove,
  assignToClinic,
};
