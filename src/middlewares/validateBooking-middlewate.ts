import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from './authentication-middleware';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingRepo from '@/repositories/booking-repository';

export async function validadeBookingRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { roomId } = req.body;
  const enrollment = await enrollmentRepository.findWithAddressByUserId(req.userId);
  if (!enrollment) return res.sendStatus(httpStatus.FORBIDDEN);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) return res.sendStatus(httpStatus.FORBIDDEN);
  if (ticket.status !== 'PAID') return res.sendStatus(httpStatus.FORBIDDEN);
  const room = await bookingRepo.getRoomById(Number(roomId));
  if (!room) return res.sendStatus(httpStatus.NOT_FOUND);

  next();
}
