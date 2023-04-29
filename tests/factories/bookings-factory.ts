// import faker from '@faker-js/faker';
import faker from '@faker-js/faker';
import { generateValidToken } from '../helpers';
import { createUser } from './users-factory';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createTicket, createTicketTypeWithHotel } from './tickets-factory';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createValidUser() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketTypeWithHotel();
  await createTicket(enrollment.id, ticketType.id, 'PAID');

  return { token, user, enrollment, ticketType };
}

export async function createFullyBookedRoom(hotelId: number, capacity: number, userId: number) {
  const room = await prisma.room.create({
    data: { hotelId, capacity, name: faker.name.jobArea() },
  });

  for (let i = 0; i < capacity; i++) {
    await prisma.booking.createMany({
      data: [{ roomId: room.id, userId }],
    });
  }

  return room;
}

export async function test(id: number) {
  return await prisma.booking.findMany({
    where: { roomId: id },
  });
}
