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
    },
  });
  return user;
};

export default {
  get,
  getById,
};
