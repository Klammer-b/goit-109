import Joi from 'joi';

export const loginUserValidationSchema = Joi.object({
  email: Joi.string().required().email().min(1).max(30),
  password: Joi.string().required().min(3),
});
