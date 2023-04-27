import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const promise = await bookingService.getUserBooking(req.userId);

    return res.status(httpStatus.OK).send(promise);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
