import { prisma } from '../lib/prisma.js';
import { AppointStatus } from '../generated/prisma/enums.js';
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './appointments.schema.js';

const get = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  return appointments;
};

const getById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  return appointment;
};

const getByUserId = async (userId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });
  return appointments;
};

const getByDoctorId = async (doctorId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { doctorId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });
  return appointments;
};

const create = async (data: CreateAppointmentInput) => {
  const appointment = await prisma.appointment.create({
    data: {
      userId: data.userId,
      doctorId: data.doctorId,

      date: data.date,
      status: data.status as AppointStatus,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  return appointment;
};

const update = async (data: { id: string } & UpdateAppointmentInput) => {
  const { id, ...updateData } = data;
  const appointment = await prisma.appointment.update({
    where: {
      id: id,
    },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  return appointment;
};

const updateStatus = async (id: string, status: AppointStatus) => {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  return appointment;
};

const remove = async (id: string) => {
  const appointment = await prisma.appointment.delete({
    where: {
      id: id,
    },
  });
  return appointment;
};

export default {
  get,
  getById,
  getByUserId,
  getByDoctorId,
  create,
  update,
  updateStatus,
  remove,
};
