class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409; // Código de estado HTTP para Conflict
  }
}

module.exports = ConflictError;