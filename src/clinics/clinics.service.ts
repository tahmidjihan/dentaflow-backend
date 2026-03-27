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
const create = () => {
  // return { message: 'Create a new clinic' };
};

const update = () => {
  return { message: 'Update a clinic' };
};
const remove = () => {
  return { message: 'Delete a clinic' };
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
