import {
  createStudent,
  deleteStudentById,
  getStudentById,
  getStudents,
  upsertStudent,
} from '../db/services/students.js';

export const getStudentsController = async (req, res) => {
  const students = await getStudents();

  res.json({
    status: 200,
    message: 'Students were found!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;

  const student = await getStudentById(studentId);

  res.json({
    status: 200,
    message: `Student with id ${studentId} was found!`,
    data: student,
  });
};

export const createStudentController = async (req, res) => {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: 'Student is created!',
    data: student,
  });
};

export const patchStudentController = async (req, res) => {
  const { studentId } = req.params;
  const { body } = req;

  const { student } = await upsertStudent(studentId, body, { upsert: false });

  res.json({
    status: 200,
    message: 'Student is updated!',
    data: student,
  });
};

export const putStudentController = async (req, res) => {
  const { studentId } = req.params;
  const { body } = req;

  const { student, isNew } = await upsertStudent(studentId, body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Student is upserted!',
    data: student,
  });
};

export const deleteStudentByIdController = async (req, res) => {
  const { studentId } = req.params;

  await deleteStudentById(studentId);

  res.status(204).send();
};
