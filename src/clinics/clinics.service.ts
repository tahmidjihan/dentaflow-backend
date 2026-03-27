import { prisma } from '../lib/prisma';
const get = () => {
  //   return { message: 'List all clinics' };
  const clinics = prisma.clinic.findMany();
  return clinics;
};
const getById = (id: string) => {
  // return { message: 'Get clinic by ID' };
  const clinic = prisma.clinic.findUnique({
    where: {
      id: id,
    },
  });
  return clinic;
};
const create = ({
  name,
  location,
  phone,
  email,
}: {
  name: string;
  location: string;
  phone: string;
  email: string;
}) => {
  // return { message: 'Create a new clinic' };
  const clinic = prisma.clinic.create({
    data: {
      name,
      email,
      location,
      phone,
    },
  });
  return clinic;
};

const update = (
  data: { id: string } & Partial<{
    name: string;
    location: string;
    phone: string;
    email: string;
  }>,
) => {
  const { id, ...updateData } = data;
  const clinic = prisma.clinic.update({
    where: {
      id: id,
    },
    data: updateData,
  });
  return clinic;
};
const remove = (id: string) => {
  const clinic = prisma.clinic.delete({
    where: {
      id: id,
    },
  });
  return clinic;
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
