import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export async function getUserBooking(userId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { userId },
  });
}

const bookingRepo = { getUserBooking };
export default bookingRepo;
