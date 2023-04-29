import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
// import * as jwt from 'jsonwebtoken';
// import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { createBooking, createFullyBookedRoom, createValidUser, test } from '../factories/bookings-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /boookings without token', () => {
  it('should respond with 401 if token is not sent', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond 401 if token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /boookings when token is valid', () => {
  it('Should respond with 404 when user has no bookings', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('Should respond with 200 when user have a booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    await createBooking(user.id, room.id);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
  });
});

describe('POST /boookings without token', () => {
  it('should respond with 401 if token is not sent', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond 401 if token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('POST /boookings when token is valid', () => {
  it('Should respond with 400 when body is not send', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  });

  it('Should respond with 404 when body is invalid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: faker.address.cityName });

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  });

  it('Should respond with 403 when ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: faker.finance.pin(2) });

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('Should respond with 403 when ticket is not paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: faker.finance.pin(2) });

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('Should respond with 404 when roomId does not exists', async () => {
    const { token } = await createValidUser();

    const response = await server
      .post('/booking')
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: faker.finance.pin(2) });

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('Should respond with 403 when room is fully booked', async () => {
    const { token, user } = await createValidUser();
    const hotel = await createHotel();
    const room = await createFullyBookedRoom(hotel.id, 2, user.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('Should respond with 200 when body is valid', async () => {
    const { token } = await createValidUser();
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(response.status).toEqual(httpStatus.OK);
  });
});
