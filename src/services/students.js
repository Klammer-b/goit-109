import createHttpError from 'http-errors';
import { StudentCollection } from '../db/models/students.js';
import { processStudentPayload } from '../utils/processPayload.js';
import { saveFile } from '../utils/saveFile.js';

const createPaginationMetadata = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = count > page * perPage;
  const hasPreviousPage = page !== 1 && page <= totalPages + 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getStudents = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const offset = (page - 1) * perPage;
  const filtersQuery = StudentCollection.find();

  if (filter.minAge) {
    filtersQuery.where('age').gte(filter.minAge);
  }

  if (filter.maxAge) {
    filtersQuery.where('age').lte(filter.maxAge);
  }

  if (filter.minAvgMark) {
    filtersQuery.where('avgMark').gte(filter.minAvgMark);
  }

  if (filter.maxAvgMark) {
    filtersQuery.where('avgMark').lte(filter.maxAvgMark);
  }

  if (filter.gender) {
    filtersQuery.where('gender').equals(filter.gender);
  }

  if (filter.onDuty || filter.onDuty === false) {
    filtersQuery.where('onDuty').equals(filter.onDuty);
  }

  const studentsQuery = StudentCollection.find()
    .merge(filtersQuery)
    .skip(offset)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const studentsCountQuery = StudentCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const [students, studentsCount] = await Promise.all([
    studentsQuery,
    studentsCountQuery,
  ]);

  const paginationMetadata = createPaginationMetadata(
    page,
    perPage,
    studentsCount,
  );

  return { items: students, ...paginationMetadata };
};

export const getStudentById = async (studentId) => {
  const student = await StudentCollection.findById(studentId);

  if (!student) {
    throw new createHttpError(404, 'Student not found');
  }

  return student;
};

export const createStudent = async (payload) => {
  const student = await StudentCollection.create(
    processStudentPayload(payload),
  );

  return student;
};

export const upsertStudent = async (
  studentId,
  { photo, ...payload },
  options = {},
) => {
  let photoUrl;
  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const response = await StudentCollection.findByIdAndUpdate(
    studentId,
    processStudentPayload({
      ...payload,
      ...(photoUrl ? { photoUrl } : {}),
    }),
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
