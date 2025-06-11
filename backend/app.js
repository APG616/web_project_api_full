const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const requestLogger = require('./middleware/request-logger');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger, logError} = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');
const { validateLogin, validateUserCreation } = require('./validators/validators');
const NotFoundError = require('./errors/not-found-error');

const app = express();

// configuración de seguridad
app.use(helmet());



// Limitación de peticiones
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por IP
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.'
});
// Loggin
app.use(requestLogger);
app.use(limiter);



// Parseo de JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas publicas
app.post('/signup', validateUserCreation, createUser);
app.post('/signin', validateLogin, login);

// Ruta de prueba de caída
app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('¡Caída del servidor!');
    }, 0);
});



const corsOptions = {
  origin: [
    'http://localhost:5173', // Puerto de Vite
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));



// Rutas protegidas
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Manejo de errores de autenticación
const errorHandler = require('./middleware/error-handler');
app.use(errors()); 
app.use(errorHandler);
app.use(errorLogger);

// Después de todas las rutas:
app.use(errors());
app.use(errorHandler);
app.use((req, res, next) => {
  next(new NotFoundError('Ruta no encontrada'));
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    next(new NotFoundError('Ruta no encontrada'));
});


// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});