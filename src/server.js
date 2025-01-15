import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { ENV_VARS } from './constants/env.js';
import { getStudentById, getStudents } from './db/services/students.js';

export const startServer = () => {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/students', async (req, res) => {
    const students = await getStudents();

    res.json(students);
  });

  app.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;

    const student = getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        status: 404,
        message: `Student with id ${studentId} not found`,
      });
    }

    res.json(student);
  });

  const PORT = getEnv(ENV_VARS.PORT);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
