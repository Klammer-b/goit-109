import Joi from 'joi';

export const resetPasswordValidationSchema = Joi.object({
  password: Joi.string().required().min(3),
  token: Joi.string().required(),
});
