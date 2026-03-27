import { stripe } from '../app';
import { prisma } from '../lib/prisma';

export const createCheckoutSession = async (data: {
  appointmentId: string;
  amount: number;
  currency: string;
}) => {
  const { appointmentId, amount, currency } = data;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { user: true, doctor: true, clinic: true },
  });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Dental Appointment Payment',
            description: `Appointment with ${appointment.doctor.name} at ${appointment.clinic.name}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata: {
      appointmentId: appointment.id,
    },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      stripeSessionId: session.id,
      amount,
      currency,
      status: 'pending',
      appointmentId: appointment.id,
    },
  });

  return session;
};

export const getPaymentBySessionId = async (sessionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      appointment: {
        include: {
          user: true,
          doctor: true,
          clinic: true,
        },
      },
    },
  });

  return payment;
};

export const getAllPayments = async () => {
  const payments = await prisma.payment.findMany({
    include: {
      appointment: {
        include: {
          user: true,
          doctor: true,
          clinic: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments;
};

export const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      appointment: {
        include: {
          user: true,
          doctor: true,
          clinic: true,
        },
      },
    },
  });

  return payment;
};

export const updatePaymentStatus = async (
  sessionId: string,
  status: 'pending' | 'paid' | 'failed',
) => {
  const payment = await prisma.payment.update({
    where: { stripeSessionId: sessionId },
    data: { status },
  });

  // If payment is successful, update appointment status
  if (status === 'paid') {
    const paymentRecord = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (paymentRecord) {
      await prisma.appointment.update({
        where: { id: paymentRecord.appointmentId },
        data: { status: 'DONE' },
      });
    }
  }

  return payment;
};

export const handleWebhookEvent = async (event: {
  type: string;
  data: { object: { id: string; payment_status?: string } };
}) => {
  const eventType = event.type;
  const session = event.data.object;

  switch (eventType) {
    case 'checkout.session.completed':
      await updatePaymentStatus(session.id, 'paid');
      break;
    case 'checkout.session.expired':
      await updatePaymentStatus(session.id, 'failed');
      break;
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }
};
