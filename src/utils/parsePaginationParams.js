import { parseNumber } from './parseNumber.js';

export const parsePaginationParams = (query) => {
  const page = parseNumber(query.page, 1);
  const perPage = parseNumber(query.perPage, 10);

  return {
    page,
    perPage,
  };
};
