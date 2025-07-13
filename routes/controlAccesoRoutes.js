const express = require('express');
const router = express.Router();
const controlAccesoController = require('../controllers/controlAccesoController');

router.get('/', controlAccesoController.getAll);
router.get('/documento/:numero_documento', controlAccesoController.getByDocumento);
router.post('/', controlAccesoController.create);
//router.delete('/documento/:numero_documento', controlAccesoController.deleteByDocumento);

module.exports = router;