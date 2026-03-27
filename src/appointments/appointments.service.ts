import { prisma } from '../lib/prisma';
import { AppointStatus } from '../generated/prisma/enums';
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './appointments.schema';

const get = () => {
  const appointments = prisma.appointment.findMany();
  return appointments;
};

const getById = (id: string) => {
  const appointment = prisma.appointment.findUnique({
    where: {
      id: id,
    },
  });
  return appointment;
};

const create = (data: CreateAppointmentInput) => {
  const appointment = prisma.appointment.create({
    data: {
      userId: data.userId,
      doctorId: data.doctorId,
      clinicId: data.clinicId,
      date: data.date,
      status: data.status as AppointStatus,
    },
  });
  return appointment;
};

const update = (data: { id: string } & UpdateAppointmentInput) => {
  const { id, ...updateData } = data;
  const appointment = prisma.appointment.update({
    where: {
      id: id,
    },
    data: updateData,
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
