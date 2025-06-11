const { logRequest } = require('./logger');

module.exports = (req, res, next) => {
    logRequest(req);
    next();
};
