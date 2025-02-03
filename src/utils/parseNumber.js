export const parseNumber = (string, defaultValue) => {
  const number = Number(string);

  if (Number.isNaN(number)) {
    return defaultValue;
  }

  return number;
};
