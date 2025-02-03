const processName = (firstName, secondName) => {
  if (!firstName || !secondName) return null;
  return firstName + ' ' + secondName;
};

export const processStudentPayload = ({
  firstName,
  secondName,
  ...payload
}) => ({
  ...payload,
  ...(processName(firstName, secondName)
    ? { name: processName(firstName, secondName) }
    : {}),
});
