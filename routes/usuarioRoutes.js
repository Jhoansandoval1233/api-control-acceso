const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

console.log('CONTROLLER:', Object.keys(usuarioController));
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);
router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.registro);
router.post('/restablecer-contrasena', usuarioController.restablecerContrasena);

module.exports = router;