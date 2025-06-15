class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.statusCode = 401; // Código de estado HTTP para Unauthorized
  }
}
module.exports = UnauthorizedError;