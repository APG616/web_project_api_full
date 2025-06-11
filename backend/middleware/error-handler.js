module.exports = (err, req, res, next) => {
    const { statusCode = 500, message } = err;
    
    // Si el código de estado es 500, se envía un mensaje genérico
    res.status(statusCode).send({
        message: statusCode === 500 ? 'Se produjo un error en el servidor' : message
    });

    if(statusCode === 500) {
        const logger = require('./logger'); 
        logger.error(`Error 500: ${message}\n${err.stack}`);
    }
};