import Joi from 'joi';

export const createBookingSchema = Joi.object<unknown>({
  roomId: Joi.number().required(),
});
