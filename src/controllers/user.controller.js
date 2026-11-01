const { enviarError } = require('../utils/respuestaError');

// Almacenamiento en memoria: usuarios iniciales de la API
const usuarios = [
  { id: 1, name: 'Marco Padilla', email: 'marco.padilla@espe.edu.ec' },
  { id: 2, name: 'Adrian Trivino', email: 'adrian.trivino@espe.edu.ec' }
];

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOLO_NUMEROS = /^\d+$/;
let ultimoId = 0;

// Genera el id con Date.now() sin repetirlo si dos usuarios se crean en el mismo milisegundo
const generarId = () => {
  ultimoId = Math.max(Date.now(), ultimoId + 1);
  return ultimoId;
};

// Devuelve el error de validación o null si los datos son correctos
const validarUsuario = (name, email) => {
  if (typeof name !== 'string' || name.trim() === '' || SOLO_NUMEROS.test(name.trim())) {
    return { status: 400, message: 'Name no puede ser un número o estar vacío' };
  }
  if (typeof email !== 'string' || email.trim() === '') {
    return { status: 400, message: 'Email es obligatorio' };
  }
  if (!EMAIL_VALIDO.test(email.trim())) {
    return { status: 400, message: 'Formato de email inválido' };
  }
  const repetido = usuarios.some((usuario) => usuario.email === email.trim().toLowerCase());
  if (repetido) {
    return { status: 409, message: 'Email ya existe' };
  }
  return null;
};

const buscarIndice = (req) => usuarios.findIndex((usuario) => usuario.id === Number(req.params.id));

// GET /api/marcopadilla/users
const obtenerUsuarios = (req, res) => {
  return res.status(200).json(usuarios);
};

// POST /api/marcopadilla/users
const crearUsuario = (req, res) => {
  const { name, email } = req.body;
  const error = validarUsuario(name, email);
  if (error) {
    return enviarError(req, res, error.status, error.message);
  }
  const nuevoUsuario = { id: generarId(), name: name.trim(), email: email.trim().toLowerCase() };
  usuarios.push(nuevoUsuario);
  return res.status(201).json(nuevoUsuario);
};

// GET /api/marcopadilla/users/:id
const obtenerUsuarioPorId = (req, res) => {
  const indice = buscarIndice(req);
  if (indice === -1) {
    return enviarError(req, res, 404, 'Usuario no encontrado');
  }
  return res.status(200).json(usuarios[indice]);
};

// DELETE /api/marcopadilla/users/:id
const eliminarUsuario = (req, res) => {
  const indice = buscarIndice(req);
  if (indice === -1) {
    return enviarError(req, res, 404, 'Usuario no encontrado');
  }
  const [usuarioEliminado] = usuarios.splice(indice, 1);
  return res.status(200).json({ message: 'Usuario eliminado correctamente', user: usuarioEliminado });
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  eliminarUsuario
};
