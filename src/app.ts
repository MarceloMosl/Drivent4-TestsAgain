import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  paymentsRouter,
  hotelsRouter,
  bookingRouter,
} from '@/routers';
// eslint-disable-next-line import/order
import { generateValidToken } from '../tests/helpers';
// eslint-disable-next-line import/order
import { createUser } from '../tests/factories/users-factory';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', async (_req, res) => {
    const user = await createUser();
    const token = await generateValidToken(user);

    console.log(token);
    return res.send('OK!');
  })
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/tickets', ticketsRouter)
  .use('/payments', paymentsRouter)
  .use('/hotels', hotelsRouter)
  .use('/booking', bookingRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
