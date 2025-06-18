// app.js
import express from 'express';
import { connect } from 'mongoose';
import bodyParser from 'body-parser'; 
const { json, urlencoded } = bodyParser; 
import cors from 'cors';
import { errors } from 'celebrate';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger, errorLogger } from './middleware/logger.js';
import auth from './middleware/auth.js';
import { createUser, login } from './controllers/users.js';
import userRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js';
import BadRequestError from './errors/bad-request-error.js';
import NotFoundError from './errors/not-found-error.js';
import errorHandler from './middleware/error-handler.js';
import { validateLogin, validateUserCreation } from './validators/validators.js';
import { celebrate, Joi } from 'celebrate';

const app = express();

// 1. Configuración de seguridad
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:3001', // URL de tu frontend
  credentials: true,
}));
// 2. Configuración CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));
// Después de app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.options('*', cors(corsOptions));

// 3. Logging de solicitudes (DEBE estar antes de las rutas)
app.use(requestLogger);

// 4. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP'
});
app.use(limiter);

app.use(errors()); // Manejo de errores de Celebrate

//Body parsing
app.use(json());
app.use(urlencoded({ extended: true }));

// Rutas públicas - DEBEN estar antes de app.use(auth)
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
}), (req, res, next) => {
  console.log('Signup body:', req.body);
  createUser(req, res, next);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
}), (req, res, next) => {
  console.log('Signin attempt:', req.body.email);
  login(req, res, next);
});

// Ruta de prueba
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('¡Caída del servidor!');
  }, 0);
});

// Rutas protegidas
app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

// Manejo de errores (DESPUÉS de las rutas)
app.use(errorLogger); // Logger de errores HTTP
app.use(errors()); // Manejo de errores de Celebrate
app.use(errorHandler); // Tu manejador de errores personalizado
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ruta no encontrada (SIEMPRE al final)
app.use((req, res, next) => {
  next(new NotFoundError('Ruta no encontrada'));
});

// Conexión a MongoDB
connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1); // Salir si no hay conexión a la DB
  });

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});