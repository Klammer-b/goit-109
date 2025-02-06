import { Router } from 'express';
import {
  createStudentController,
  deleteStudentByIdController,
  getStudentByIdController,
  getStudentsController,
  patchStudentController,
  putStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStudentValidationSchema } from '../validation/createStudentValidationSchema.js';
import { updateStudentValidationSchema } from '../validation/updateStudentValidationSchema.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/roles.js';

const studentsRouter = Router();

studentsRouter.use('/', authenticate);

studentsRouter.use('/:studentId', validateMongoId('studentId'));

studentsRouter.get(
  '/',
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(getStudentsController),
);

studentsRouter.get(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  ctrlWrapper(getStudentByIdController),
);

studentsRouter.post(
  '/',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(createStudentValidationSchema),
  ctrlWrapper(createStudentController),
);

studentsRouter.patch(
  '/:studentId',
  checkRoles(ROLES.PARENT),
  validateBody(updateStudentValidationSchema),
  ctrlWrapper(patchStudentController),
);

studentsRouter.put(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(createStudentValidationSchema),
  ctrlWrapper(putStudentController),
);

studentsRouter.delete(
  '/:studentId',
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(deleteStudentByIdController),
);

export default studentsRouter;
