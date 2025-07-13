const express = require('express');
const router = express.Router();
const personaVehiculoController = require('../controllers/personaVehiculoController');

router.post('/', personaVehiculoController.create);
router.get('/persona/:personaId/vehiculos', personaVehiculoController.getVehiculosByPersona);
router.get('/vehiculo/:vehiculoId/personas', personaVehiculoController.getPersonasByVehiculo);
router.delete('/:personaId/:vehiculoId', personaVehiculoController.delete);

module.exports = router;