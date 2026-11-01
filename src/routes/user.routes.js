const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Las rutas se montan en /api/marcopadilla/users desde appPadillaMarco.js
router.get('/', userController.obtenerUsuarios);
router.post('/', userController.crearUsuario);
router.get('/:id', userController.obtenerUsuarioPorId);
router.delete('/:id', userController.eliminarUsuario);

module.exports = router;
