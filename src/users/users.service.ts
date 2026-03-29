import { prisma } from '../lib/prisma';

const get = () => {
  const users = prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      clinicId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

const getById = (id: string) => {
  const user = prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      clinicId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

const update = async (data: {
  id: string;
  name?: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'DOCTOR';
  clinicId?: string | null;
}) => {
  const user = await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      clinicId: data.clinicId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      clinicId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

const remove = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
};

const assignToClinic = async (data: { userId: string; clinicId: string }) => {
  const user = await prisma.user.update({
    where: { id: data.userId },
    data: { clinicId: data.clinicId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clinicId: true,
    },
  });
  return user;
};

const getByEmail = (email: string) => {
  const user = prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      clinicId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export default {
  get,
  getById,
  update,
  remove,
  assignToClinic,
  getByEmail,
};
