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
    },
  });
  return doctors;
};

export default {
  get,
};
