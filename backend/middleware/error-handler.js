module.exports = (err, req, res, next) => {
  const { statusCode = 500, message, validationErrors } = err;
  
  const response = {
    message: statusCode === 500 ? 'Internal server error' : message
  };

  if (validationErrors) {
    response.errors = validationErrors;
  }

  res.status(statusCode).send(response);

  if (statusCode === 500) {
    console.error(`Server Error: ${message}\n${err.stack}`);
  }
};