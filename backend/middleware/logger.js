const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const fs = require('fs');

// Configuración común de formatos
const { combine, timestamp, printf, json, prettyPrint } = winston.format;

// Formato para consola
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, stack, req, res }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (stack) log += `\n${stack}`;
    if (req) log += ` | ${req.method} ${req.url}`;
    if (res) log += ` - ${res.statusCode}`;
    return log;
  })
);

// Logger para solicitudes HTTP
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/requests.log'),
      level: 'info'
    }),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  format: combine(
    json(),
    prettyPrint()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false
});

// Logger para errores HTTP
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error'
    }),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  format: combine(
    timestamp(),
    json(),
    prettyPrint()
  )
});

// Logger para errores de aplicación
const appLogger = winston.createLogger({
  level: 'error',
  format: combine(
    timestamp(),
    json(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/app.log')
    }),
    new winston.transports.Console({
      format: consoleFormat
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