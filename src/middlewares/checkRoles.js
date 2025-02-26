import createHttpError from 'http-errors';
import { ROLES } from '../constants/roles.js';
import { StudentCollection } from '../db/models/students.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw createHttpError(401, 'User not found');
      }
      const userRole = req.user.role;

      if (userRole === ROLES.TEACHER && roles.includes(ROLES.TEACHER)) {
        return next();
      }

      if (userRole === ROLES.PARENT && roles.includes(ROLES.PARENT)) {
        const { studentId } = req.params;

        if (!studentId) {
          return next();
        }

        const student = await StudentCollection.findOne({ _id: studentId });

        if (!student) {
          return next(createHttpError(404, 'Student not found'));
        }

        if (req.user._id.equals(student.parentId)) {
          return next();
        }
      }

      return next(createHttpError(403, 'Such action in unauthorized'));
    } catch (err) {
      next(err);
    }
  };
