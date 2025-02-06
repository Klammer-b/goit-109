import Joi from 'joi';
import { GENDERS } from '../constants/gender.js';
import { isValidObjectId } from 'mongoose';

export const createStudentValidationSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(20),
  secondName: Joi.string().required().min(1).max(20),
  age: Joi.number().integer().required().min(6).max(18),
  gender: Joi.string()
    .required()
    .valid(...Object.values(GENDERS)),
  avgMark: Joi.number().required().min(1).max(12),
  onDuty: Joi.boolean(),
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }

    return true;
  }),
});
