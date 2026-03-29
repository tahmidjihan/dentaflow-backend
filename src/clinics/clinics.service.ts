import { prisma } from '../lib/prisma.js';
import type { CreateClinicInput, UpdateClinicInput } from './clinics.schema.js';

const get = () => {
  const clinics = prisma.clinic.findMany();
  return clinics;
};

const getById = (id: string) => {
  const clinic = prisma.clinic.findUnique({
    where: {
      id: id,
    },
  });
  return clinic;
};

const create = (data: CreateClinicInput) => {
  const clinic = prisma.clinic.create({
    data: {
      name: data.name,
      email: data.email,
      location: data.location,
      phone: data.phone,
    },
  });
  return clinic;
};

const update = (data: { id: string } & UpdateClinicInput) => {
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
