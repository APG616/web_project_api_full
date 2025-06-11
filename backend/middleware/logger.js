const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const fs = require('fs');

// configuración de formatos
const { combine, timestamp, printf, json } = winston.format;

// Logger for requests using express-winston
const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/requests.log'),
            level: 'info',
        }),
        new winston.transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf(({ level, message, meta, timestamp, req, res }) => {
                    return `[${timestamp}] ${req.method} ${req.url} - ${res.statusCode}`;
                })
            )
        })
    ],
    format: combine(
        json(),
        winston.format.prettyPrint()
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
});

// Logger for errors using a write stream
const errorLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/errors.log'),
    { flags: 'a' }
);

const errorLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/errors.log'),
            level: 'error',
            })
        ],
        format: combine(
            timestamp(),
            json(),
            winston.format.prettyPrint()
        )
    });

const appLogger = winston.createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        json(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/app.log'),
        }),
        new winston.transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf(({ level, message, timestamp, stack }) => {
                    return `[${timestamp}] ${level}: ${message} ${stack ? '\n' + stack : ''}`;
                })
            )
        })
    ]
});



module.exports = {
  requestLogger,
  errorLogger,
  logError: (error) => {
    appLogger.error({
      message: error.message || 'Error desconocido',
      stack: error.stack,
      ...error
    });
  }
};