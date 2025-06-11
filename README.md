# AroundB API 🚀

API REST para una aplicación de tarjetas y perfiles de usuario, con autenticación JWT y base de datos MongoDB.

## 📌 Características Principales

- **Autenticación JWT** (registro/login)
- **CRUD completo** para usuarios y tarjetas
- **Seguridad mejorada**:
  - Rate limiting (100 peticiones/15min por IP)
  - Helmet para protección de headers HTTP
  - CORS configurado específicamente
- **Logging avanzado** con Winston:
  - Registro de solicitudes HTTP
  - Trazabilidad de errores
- **Validación de datos** con Celebrate

## 🛠 Tecnologías Utilizadas

| Tecnología       | Uso                          |
|------------------|------------------------------|
| Node.js          | Entorno de ejecución         |
| Express         | Framework web                |
| MongoDB         | Base de datos NoSQL          |
| Mongoose        | ODM para MongoDB             |
| JWT             | Autenticación                |
| Winston         | Sistema de logging           |
| Celebrate       | Validación de datos          |
| Helmet          | Seguridad HTTP               |
| express-rate-limit | Control de peticiones     |

## 🔧 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/aroundb-api.git
   cd aroundb-api/backend

Instalar dependencias:
bash

npm install

Configurar variables de entorno:
Crear .env en /backend:
env

JWT_SECRET=tu_clave_secreta_jwt
PORT=3000

Iniciar MongoDB:
bash

# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod

Ejecutar el servidor:
bash

npm run dev

Estructura de Directorios
text

backend/
├── controllers/    # Lógica de negocio
├── middleware/     # Auth, logging, etc.
├── models/         # Esquemas de MongoDB
├── routes/         # Definición de rutas
├── validators/     # Validación de datos
├── logs/           # Archivos de registro
└── app.js          # Entrada principal

🌐 Endpoints Principales
Método	Ruta	Descripción	Autenticación
POST	/signup	Registrar nuevo usuario	No
POST	/signin	Iniciar sesión	No
GET	/users	Obtener todos los usuarios	Sí
GET	/users/:id	Obtener usuario específico	Sí
GET	/cards	Obtener todas las tarjetas	Sí
POST	/cards	Crear nueva tarjeta	Sí


Sistema de Logging

Registra en 3 archivos diferentes:

    requests.log: Todas las solicitudes HTTP

    errors.log: Errores de la aplicación

    app-errors.log: Errores personalizados

Ejemplo de entrada:
json

{
  "timestamp": "2023-06-15T14:30:22.123Z",
  "level": "error",
  "message": "User not found",
  "stack": "Error: User not found\n    at ...",
  "method": "GET",
  "path": "/api/users/123"
}

Manejo de Errores

Códigos de estado HTTP:

    400 - Solicitud incorrecta

    401 - No autorizado

    404 - Recurso no encontrado

    429 - Demasiadas peticiones

    500 - Error interno del servidor

Dependencias
json

"dependencies": {
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "winston": "^3.8.2",
  "express-winston": "^4.2.0",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.7.0"
}