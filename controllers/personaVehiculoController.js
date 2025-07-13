const PersonaVehiculo = require('../models/personaVehiculoModel');

const personaVehiculoController = {
  create: (req, res) => {
    const { personaId, vehiculoId } = req.body;
    
    if (!personaId || !vehiculoId) {
      return res.status(400).json({ 
        error: 'Se requieren personaId y vehiculoId' 
      });
    }

    PersonaVehiculo.create(personaId, vehiculoId, (err, result) => {
      if (err) {
        console.error('Error al crear relación persona-vehículo:', err);
        return res.status(500).json({ 
          error: 'Error al crear la relación persona-vehículo' 
        });
      }
      res.status(201).json({ 
        message: 'Relación persona-vehículo creada exitosamente',
        id: result.insertId 
      });
    });
  },

  getVehiculosByPersona: (req, res) => {
    const { personaId } = req.params;

    PersonaVehiculo.getVehiculosByPersona(personaId, (err, results) => {
      if (err) {
        console.error('Error al obtener vehículos:', err);
        return res.status(500).json({ 
          error: 'Error al obtener los vehículos' 
        });
      }
      res.json(results);
    });
  },

  getPersonasByVehiculo: (req, res) => {
    const { vehiculoId } = req.params;

    PersonaVehiculo.getPersonasByVehiculo(vehiculoId, (err, results) => {
      if (err) {
        console.error('Error al obtener personas:', err);
        return res.status(500).json({ 
          error: 'Error al obtener las personas' 
        });
      }
      res.json(results);
    });
  },

  delete: (req, res) => {
    const { personaId, vehiculoId } = req.params;

    PersonaVehiculo.delete(personaId, vehiculoId, (err) => {
      if (err) {
        console.error('Error al eliminar relación:', err);
        return res.status(500).json({ 
          error: 'Error al eliminar la relación persona-vehículo' 
        });
      }
      res.json({ 
        message: 'Relación persona-vehículo eliminada exitosamente' 
      });
    });
  }
};

module.exports = personaVehiculoController;