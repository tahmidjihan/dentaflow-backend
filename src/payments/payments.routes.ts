import { stripe } from '@/app';
import express from 'express';
import { createPaymentSchema } from './payments.schema';
import { prisma } from '@/lib/prisma';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Payments API is working!' });
});
router.post('/create-payment', async (req, res) => {
  const body = createPaymentSchema.safeParse(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ error: 'Invalid payment data', details: body.error });
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: process.env.STRIPE_PRICE_ID as string,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}?success=true`,
  });
  // console.log(session);
  if (session.url) {
    // return res.json({ url: session.url });
    await prisma.payment.create({
      data: {
        appointmentId: body.data.appointmentId,
        amount: body.data.amount,
        stripeSessionId: session.id,
      },
    });
    return res.json({ url: session.url });
  }
  return res.status(500).json({ error: 'Failed to create payment session' });
  // res.redirect(303, session.url);
});

export default router;
