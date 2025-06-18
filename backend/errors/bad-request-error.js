class BadRequestError extends Error {
  constructor(message = 'Datos de solicitud incorrectos', validationErrors = []) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
    this.validationErrors = validationErrors;
  }
}

export default BadRequestError; // This should be the ONLY export