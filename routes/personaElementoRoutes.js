const express = require('express');
const router = express.Router();
const personaElementoController = require('../controllers/personaElementoController');

router.post('/', personaElementoController.create);
router.get('/persona/:personaId/elementos', personaElementoController.getElementsByPersona);
router.get('/elemento/:elementoId/personas', personaElementoController.getPersonasByElemento);
router.delete('/:personaId/:elementoId', personaElementoController.delete);

module.exports = router;