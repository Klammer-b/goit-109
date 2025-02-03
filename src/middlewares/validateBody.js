export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: false,
      convert: false,
    });
    next();
  } catch (err) {
    next(err);
  }
};
