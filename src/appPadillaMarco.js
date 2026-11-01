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

// JSON mal formado en el cuerpo de la petición
app.use((err, req, res, _next) => {
  enviarError(req, res, 400, 'El cuerpo de la petición no es un JSON válido');
});

// El servidor solo se levanta al ejecutar el archivo, no al importarlo en las pruebas
if (require.main === module) {
  app.listen(puerto, () => {
    process.stdout.write(`Servidor ejecutándose en http://localhost:${puerto}\n`);
  });
}

module.exports = app;
