import Joi from 'joi';

export const verifyGoogleOAuthCodeValidationSchema = Joi.object({
  code: Joi.string().required(),
});
