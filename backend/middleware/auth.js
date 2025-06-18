import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error.js';

const authMiddleware = (req, res, next) => {
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

export default authMiddleware;