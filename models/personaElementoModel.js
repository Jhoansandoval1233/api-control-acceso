const db = require('../config/db');

const PersonaElemento = {
  create: (personaId, elementoId, callback) => {
    db.query(
      'INSERT INTO personas_elementos (persona_id, elemento_id) VALUES (?, ?)',
      [personaId, elementoId],
      callback
    );
  },

  getElementsByPersona: (personaId, callback) => {
    db.query(
      `SELECT e.* FROM elementos e 
       INNER JOIN personas_elementos pe ON e.id = pe.elemento_id 
       WHERE pe.persona_id = ?`,
      [personaId],
      callback
    );
  },

  getPersonasByElemento: (elementoId, callback) => {
    db.query(
      `SELECT p.* FROM personas p 
       INNER JOIN personas_elementos pe ON p.id = pe.persona_id 
       WHERE pe.elemento_id = ?`,
      [elementoId],
      callback
    );
  },

  delete: (personaId, elementoId, callback) => {
    db.query(
      'DELETE FROM personas_elementos WHERE persona_id = ? AND elemento_id = ?',
      [personaId, elementoId],
      callback
    );
  }
};

module.exports = PersonaElemento;