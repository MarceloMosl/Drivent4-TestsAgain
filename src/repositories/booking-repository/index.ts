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
export async function getBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

export async function getRoomById(roomId: number) {
  return await prisma.room.findFirst({
    where: { id: roomId },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepo = { getUserBooking, getRoomById, getBookingsByRoomId, createBooking };
export default bookingRepo;
