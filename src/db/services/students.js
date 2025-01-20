import createHttpError from 'http-errors';
import { StudentCollection } from '../models/students.js';

export const getStudents = async () => {
  const students = await StudentCollection.find();

  return students;
};

export const getStudentById = async (studentId) => {
  const student = await StudentCollection.findById(studentId);

  if (!student) {
    throw new createHttpError(404, 'Student not found');
  }

  return student;
};
