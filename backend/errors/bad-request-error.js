class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // Código de estado HTTP para Bad Request
    
  }
}

module.exports = BadRequestError;