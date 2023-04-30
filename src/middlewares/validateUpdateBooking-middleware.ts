import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from './authentication-middleware';
import bookingRepo from '@/repositories/booking-repository';

export async function validateUptadeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { roomId } = req.params;
  const booking = await bookingRepo.getBookingsByUserId(req.userId);
  if (!booking) return res.sendStatus(httpStatus.FORBIDDEN);

  const room = await bookingRepo.getRoomById(Number(roomId));
  if (!room) return res.sendStatus(httpStatus.NOT_FOUND);

  next();
}
