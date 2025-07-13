const db = require('../config/db');

const PersonaVehiculo = {
  create: (personaId, vehiculoId, callback) => {
    db.query(
      'INSERT INTO personas_vehiculos (persona_id, vehiculo_id) VALUES (?, ?)',
      [personaId, vehiculoId],
      callback
    );
  },

  getVehiculosByPersona: (personaId, callback) => {
    db.query(
      `SELECT v.* FROM vehiculos v 
       INNER JOIN personas_vehiculos pv ON v.id = pv.vehiculo_id 
       WHERE pv.persona_id = ?`,
      [personaId],
      callback
    );
  },

  getPersonasByVehiculo: (vehiculoId, callback) => {
    db.query(
      `SELECT p.* FROM personas p 
       INNER JOIN personas_vehiculos pv ON p.id = pv.persona_id 
       WHERE pv.vehiculo_id = ?`,
      [vehiculoId],
      callback
    );
  },

  delete: (personaId, vehiculoId, callback) => {
    db.query(
      'DELETE FROM personas_vehiculos WHERE persona_id = ? AND vehiculo_id = ?',
      [personaId, vehiculoId],
      callback
    );
  }
};

module.exports = PersonaVehiculo;