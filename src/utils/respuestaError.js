// Respuesta de error con el mismo formato en toda la API
const enviarError = (req, res, status, message) => {
  return res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    message,
    path: req.originalUrl
  });
};

module.exports = { enviarError };
