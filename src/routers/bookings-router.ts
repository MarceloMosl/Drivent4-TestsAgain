import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getUserBooking } from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getUserBooking);

export { bookingRouter };
