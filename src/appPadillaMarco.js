const express = require('express');
const userRoutes = require('./routes/user.routes');
const { enviarError } = require('./utils/respuestaError');

const app = express();
const puerto = process.env.PORT || 3000;

// Middleware para leer el cuerpo de las peticiones en JSON
app.use(express.json());

// Rutas de la API de usuarios
app.use('/api/marcopadilla/users', userRoutes);

// Ruta general: cualquier endpoint que no exista
app.use((req, res) => {
  enviarError(req, res, 404, 'Endpoint no encontrado');
});

// Manejo de errores: JSON mal formado (400) o error inesperado (500)
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return enviarError(req, res, 400, 'El cuerpo de la petición no es un JSON válido');
  }
  return enviarError(req, res, 500, 'Error interno del servidor');
});

// El servidor solo se levanta al ejecutar el archivo, no al importarlo en las pruebas
if (require.main === module) {
  app.listen(puerto, () => {
    process.stdout.write(`Servidor ejecutándose en http://localhost:${puerto}\n`);
  });
}

module.exports = app;
