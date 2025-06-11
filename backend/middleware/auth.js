const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorized-error');

module.exports = ( req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'No autorizado' });
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    } catch (err) {
        return res.status(401).send({ message: 'No autorizado' });
    }

    req.user = payload;
    next();
}