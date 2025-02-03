import Joi from 'joi';
import { GENDERS } from '../constants/gender.js';

export const updateStudentValidationSchema = Joi.object({
  firstName: Joi.string().min(1).max(20),
  secondName: Joi.when('firstName', {
    is: Joi.string().required(),
    then: Joi.string().required(),
  }),
  age: Joi.number().integer().min(6).max(18),
  gender: Joi.string().valid(...Object.values(GENDERS)),
  avgMark: Joi.number().min(1).max(12),
  onDuty: Joi.boolean(),
});
