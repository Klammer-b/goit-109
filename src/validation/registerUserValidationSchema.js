import Joi from 'joi';

export const registerUserValidationSchema = Joi.object({
  name: Joi.string().required().min(1).max(30),
  email: Joi.string().required().email().min(1).max(30),
  password: Joi.string().required().min(3),
});
