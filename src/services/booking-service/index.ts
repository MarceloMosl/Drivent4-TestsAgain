import bookingRepo from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

export async function getUserBooking(userId: number) {
  const promise = await bookingRepo.getUserBooking(userId);

  if (promise.length === 0) throw notFoundError();

  return promise;
}

const bookingService = { getUserBooking };

export default bookingService;