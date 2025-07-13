const Vehiculo = require('../models/vehiculoModel');

const vehiculoController = {
  getAll: (req, res) => {
    Vehiculo.getAll((err, results) => {
      if (err) {
        console.error('Error al obtener los vehículos:', err);
        return res.status(500).json({ error: 'Error al obtener los vehículos' });
      }
      res.json(results);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Vehiculo.getById(id, (err, results) => {
      if (err) {
        console.error('Error al obtener el vehículo:', err);
        return res.status(500).json({ error: 'Error al obtener el vehículo' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      res.json(results[0]);
    });
  },

  create: (req, res) => {
    console.log('Request body:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: 'El cuerpo de la solicitud está vacío' 
      });
    }

    const { placa, tipo_vehiculo, persona_id } = req.body;

    // Validar campos requeridos
    if (!placa || !tipo_vehiculo || !persona_id) {
      return res.status(400).json({
        error: 'placa, tipo_vehiculo y persona_id son campos requeridos',
        received: { placa, tipo_vehiculo, persona_id }
      });
    }

    // Validar tipo_vehiculo según ENUM
    const tiposValidos = ['automovil', 'motocicleta', 'otro'];
    if (!tiposValidos.includes(tipo_vehiculo.toLowerCase())) {
      return res.status(400).json({
        error: 'Tipo de vehículo inválido',
        permitidos: tiposValidos,
        recibido: tipo_vehiculo
      });
    }

    const vehiculoData = {
      placa: placa.toUpperCase(),
      tipo_vehiculo: tipo_vehiculo.toLowerCase(),
      persona_id: parseInt(persona_id)
    };

    Vehiculo.create(vehiculoData, (err, result) => {
      if (err) {
        console.error('Error al crear vehículo:', err);
        return res.status(500).json({ error: 'Error al crear el vehículo' });
      }
      res.status(201).json({
        message: 'Vehículo creado exitosamente',
        id: result.insertId,
        vehiculo: vehiculoData
      });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const updatedVehiculo = req.body;
    Vehiculo.update(id, updatedVehiculo, (err) => {
      if (err) {
        console.error('Error al actualizar el vehículo:', err);
        return res.status(500).json({ error: 'Error al actualizar el vehículo' });
      }
      res.json({ message: 'Vehículo actualizado correctamente' });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Vehiculo.delete(id, (err) => {
      if (err) {
        console.error('Error al eliminar el vehículo:', err);
        return res.status(500).json({ error: 'Error al eliminar el vehículo' });
      }
      res.json({ message: 'Vehículo eliminado correctamente' });
    });
  }
};

module.exports = vehiculoController;
