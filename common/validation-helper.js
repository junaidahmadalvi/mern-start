const yupErrorCheck = (error) => {
  const validationErrors = {};

  error.inner &&
    error.inner.length > 0 &&
    error.inner.forEach((validationError) => {
      validationErrors[validationError.path] = validationError.message;
    });

  const entries = Object.entries(validationErrors);
  return (
    entries &&
    entries.length > 0 && {
      status: "fail",
      error: entries[0][1],
    }
  );
};

module.exports = { yupErrorCheck };
