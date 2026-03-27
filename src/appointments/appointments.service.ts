import { prisma } from '../lib/prisma';

const get = () => {
  //   return { message: 'List all appointments' };
  const appointments = prisma.appointment.findMany();
  return appointments;
};
const getById = (id: string) => {
  // return { message: 'Get appointment by ID' };
  const appointment = prisma.appointment.findUnique({
    where: {
      id: id,
    },
  });
  return appointment;
};
const create = ({
  userId,
  doctorId,
  clinicId,
  date,
  status,
}: {
  userId: string;
  doctorId: string;
  clinicId: string;
  date: Date;
  status?: string;
}) => {
  // return { message: 'Create a new appointment' };
  const appointment = prisma.appointment.create({
    data: {
      userId,
      doctorId,
      clinicId,
      date,
      status: status as any,
    },
  });
  return appointment;
};

const update = (
  data: { id: string } & Partial<{
    userId: string;
    doctorId: string;
    clinicId: string;
    date: Date;
    status: string;
  }>,
) => {
  const { id, ...updateData } = data;
  const appointment = prisma.appointment.update({
    where: {
      id: id,
    },
    data: updateData as any,
  });
  return appointment;
};
const remove = (id: string) => {
  const appointment = prisma.appointment.delete({
    where: {
      id: id,
    },
  });
  return appointment;
};

export default {
  get,
  getById,
  create,
  update,
  remove,
};
