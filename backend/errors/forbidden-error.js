class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = 403; // Código de estado HTTP para Forbidden
  }
}

export default ForbiddenError;