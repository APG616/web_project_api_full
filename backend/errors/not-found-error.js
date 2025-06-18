class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404; // Código de estado HTTP para Not Found
    }
}

export default NotFoundError;