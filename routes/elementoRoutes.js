const express = require('express');
const router = express.Router();
const elementoController = require('../controllers/elementoController');

router.get('/', elementoController.getAll);
router.get('/:id', elementoController.getById);
router.post('/', elementoController.create);
router.put('/:id', elementoController.update);
router.delete('/:id', elementoController.delete);

module.exports = router;