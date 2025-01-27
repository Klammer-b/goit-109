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

export const createStudent = async (payload) => {
  const student = await StudentCollection.create(payload);

  return student;
};

export const upsertStudent = async (studentId, payload, options = {}) => {
  const response = await StudentCollection.findByIdAndUpdate(
    studentId,
    payload,
    { ...options, new: true, includeResultMetadata: true },
  );

  const student = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  if (!student) {
    throw new createHttpError(404, 'Student not found');
  }

  return {
    student,
    isNew,
  };
};

export const deleteStudentById = async (studentId) => {
  await StudentCollection.findByIdAndDelete(studentId);
};
