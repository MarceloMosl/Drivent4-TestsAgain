import { prisma } from '@/config';

export async function getBookingById(id: number) {
  return prisma.booking.findFirst({
    where: { id },
  });
}

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
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function changeBookingRoom(roomId: number, id: number) {
  return prisma.booking.update({
    data: {
      roomId,
    },
    where: { id },
  });
}

const bookingRepo = {
  getBookingById,
  getUserBooking,
  getRoomById,
  getBookingsByRoomId,
  createBooking,
  changeBookingRoom,
};
export default bookingRepo;
