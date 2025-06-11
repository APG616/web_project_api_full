module.exports = {
  apps: [{
    name: 'aroundb-api',
    script: './app.js',
    instances: 1,                  // Para proyectos pequeños, 1 instancia es suficiente
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',    // Ajusta según los recursos de tu servidor
    env: {
      NODE_ENV: 'development',
      JWT_SECRET: 'dev-secret',    // Clave para desarrollo (no usar en producción)
      DB_URL: 'mongodb://localhost:27017/aroundb',
    },
    env_production: {
      NODE_ENV: 'production',
      JWT_SECRET: process.env.JWT_SECRET, // Usará la variable del servidor
      DB_URL: process.env.DB_URL,         // Ejemplo: MongoDB Atlas
    },
  }],
};
