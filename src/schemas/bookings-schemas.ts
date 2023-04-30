import Joi from 'joi';

export const createBookingSchema = Joi.object<unknown>({
  roomId: Joi.number().required(),
});

export const updateBookingSchema = Joi.object<unknown>({
  bookingId: Joi.number().required(),
});
