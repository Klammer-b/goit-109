import { getStudentById, getStudents } from '../db/services/students.js';

export const getStudentsController = async (req, res) => {
  const students = await getStudents();

  res.json(students);
};

export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;

  const student = await getStudentById(studentId);

  res.json(student);
};
