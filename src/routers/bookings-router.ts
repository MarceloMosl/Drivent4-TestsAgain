import { Router } from 'express';
import { authenticateToken, validadeBookingRequest, validateBody, validateParams } from '@/middlewares';
import { createBooking, getUserBooking, updateBookingRoom } from '@/controllers/booking-controller';
import { createBookingSchema, updateBookingSchema } from '@/schemas/bookings-schemas';
import { validateUptadeBooking } from '@/middlewares/validateUpdateBooking-middleware';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getUserBooking);

bookingRouter.post('/', authenticateToken, validateBody(createBookingSchema), validadeBookingRequest, createBooking);

bookingRouter.put(
  '/:bookingId',
  authenticateToken,
  validateParams(updateBookingSchema),
  validateUptadeBooking,
  updateBookingRoom,
);

export { bookingRouter };
