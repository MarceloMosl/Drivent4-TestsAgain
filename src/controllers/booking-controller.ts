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

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  try {
    const promise = await bookingService.createBooking(req.userId, Number(roomId));
    return res.status(httpStatus.OK).send({ bookingId: promise.id });
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).send(error);
  }
}

export async function updateBookingRoom(req: AuthenticatedRequest, res: Response) {
  const { bookingId } = req.params;
  const { roomId } = req.body;
  try {
    const promise = await bookingService.updateBookingRoom(Number(bookingId), roomId);
    return res.status(httpStatus.OK).send({ bookingId: promise.id });
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).send(error);
  }
}
