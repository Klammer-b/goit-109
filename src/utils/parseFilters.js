import { GENDERS } from '../constants/gender.js';
import { parseNumber } from './parseNumber.js';

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};
const parseGender = (string) => {
  if (Object.values(GENDERS).includes(string)) return string;
};

export const parseFilters = (filter = {}) => {
  return {
    minAge: parseNumber(filter.minAge),
    maxAge: parseNumber(filter.maxAge),
    minAvgMark: parseNumber(filter.minAvgMark),
    maxAvgMark: parseNumber(filter.maxAvgMark),
    gender: parseGender(filter.gender),
    onDuty: parseBoolean(filter.onDuty),
  };
};
