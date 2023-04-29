import { prisma } from '@/config';

export async function getUserBooking(userId: number): Promise<unknown> {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

const bookingRepo = { getUserBooking };
export default bookingRepo;
