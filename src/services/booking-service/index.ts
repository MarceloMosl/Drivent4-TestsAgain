import { Booking } from '@prisma/client';
import bookingRepo from '@/repositories/booking-repository';
import { conflictError, notFoundError } from '@/errors';

export async function getUserBooking(userId: number) {
  const promise = await bookingRepo.getUserBooking(userId);

  if (!promise) throw notFoundError();

  return promise;
}

export async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const room = await bookingRepo.getRoomById(roomId);
  const roomBookings = await bookingRepo.getBookingsByRoomId(roomId);
  if (room.capacity === roomBookings.length) throw conflictError('Room fully booked');

  return await bookingRepo.createBooking(userId, roomId);
}

export async function updateBookingRoom(userId: number, roomId: number) {
  const room = await bookingRepo.getRoomById(roomId);
  const roomBookings = await bookingRepo.getBookingsByRoomId(roomId);
  if (room.capacity === roomBookings.length) throw conflictError('Room fully booked');

  const { id } = await bookingRepo.getBookingsByUserId(userId);

  return await bookingRepo.changeBookingRoom(roomId, id);
}

const bookingService = { getUserBooking, createBooking, updateBookingRoom };

export default bookingService;
