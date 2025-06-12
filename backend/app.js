const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middleware/logger'); // Cambio importante aquí
const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');
const { validateLogin, validateUserCreation } = require('./validators/validators');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middleware/error-handler');

const app = express();

// 1. Configuración de seguridad
app.use(helmet());

// 2. Configuración CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Logging de solicitudes (DEBE estar antes de las rutas)
app.use(requestLogger);

// 4. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP'
});
app.use(limiter);

// 5. Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas públicas
app.post('/signup', validateUserCreation, createUser);
app.post('/signin', validateLogin, login);

// Ruta de prueba
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('¡Caída del servidor!');
  }, 0);
});

// Rutas protegidas
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Manejo de errores (DESPUÉS de las rutas)
app.use(errorLogger); // Logger de errores HTTP
app.use(errors()); // Manejo de errores de Celebrate
app.use(errorHandler); // Tu manejador de errores personalizado

// Ruta no encontrada (SIEMPRE al final)
app.use((req, res, next) => {
  next(new NotFoundError('Ruta no encontrada'));
});

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1); // Salir si no hay conexión a la DB
  });

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});