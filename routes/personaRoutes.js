const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

router.get('/', personaController.getAll);
router.get('/documento/:numero_documento', personaController.getByDocumento);
router.post('/', personaController.create);
router.put('/:numero_documento', personaController.update);
router.delete('/:numero_documento', personaController.delete);

module.exports = router;
