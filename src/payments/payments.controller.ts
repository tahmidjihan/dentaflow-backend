import express from 'express';
import { z } from 'zod';
import { stripe } from '../app';
import * as paymentService from './payments.service';
import {
  createPaymentSchema,
  paymentIdSchema,
  sessionIdSchema,
} from './payments.schema';

const createCheckout = async (req: express.Request, res: express.Response) => {
  try {
    const validated = createPaymentSchema.parse(req.body);
    const session = await paymentService.createCheckoutSession(validated);
    res.status(201).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: error });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create checkout session' });
    return;
  }
};

const getPaymentBySession = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const validated = sessionIdSchema.parse(req.query);
    const payment = await paymentService.getPaymentBySessionId(
      validated.sessionId,
    );
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid session ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch payment' });
    return;
  }
};

const getPaymentById = async (req: express.Request, res: express.Response) => {
  try {
    const validated = paymentIdSchema.parse(req.params);
    const payment = await paymentService.getPaymentById(validated.id);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: 'Invalid payment ID', details: error });
    }
    res.status(500).json({ error: 'Failed to fetch payment' });
    return;
  }
};

const getAllPayments = async (_req: express.Request, res: express.Response) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
    return;
  }
};

const handleWebhook = async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    await paymentService.handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
    return;
  }
};

export default {
  createCheckout,
  getPaymentBySession,
  getPaymentById,
  getAllPayments,
  handleWebhook,
};
