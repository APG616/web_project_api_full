class BadRequestError extends Error {
  constructor(message = 'Datos de solicitud incorrectos', validationErrors = []) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
    this.validationErrors = validationErrors;
  }
}

module.exports = BadRequestError; // This should be the ONLY export