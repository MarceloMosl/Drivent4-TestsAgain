import { Router } from 'express';
import { authenticateToken, validadeBookingRequest, validateBody } from '@/middlewares';
import { createBooking, getUserBooking } from '@/controllers/booking-controller';
import { createBookingSchema } from '@/schemas/bookings-schemas';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getUserBooking);

bookingRouter.post('/', authenticateToken, validateBody(createBookingSchema), validadeBookingRequest, createBooking);

export { bookingRouter };
