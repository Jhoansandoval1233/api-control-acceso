const PersonaElemento = require('../models/personaElementoModel');

const personaElementoController = {
  create: (req, res) => {
    const { personaId, elementoId } = req.body;
    
    if (!personaId || !elementoId) {
      return res.status(400).json({ 
        error: 'Se requieren personaId y elementoId' 
      });
    }

    PersonaElemento.create(personaId, elementoId, (err, result) => {
      if (err) {
        console.error('Error al crear relación persona-elemento:', err);
        return res.status(500).json({ 
          error: 'Error al crear la relación persona-elemento' 
        });
      }
      res.status(201).json({ 
        message: 'Relación persona-elemento creada exitosamente',
        id: result.insertId 
      });
    });
  },

  getElementsByPersona: (req, res) => {
    const { personaId } = req.params;

    PersonaElemento.getElementsByPersona(personaId, (err, results) => {
      if (err) {
        console.error('Error al obtener elementos:', err);
        return res.status(500).json({ 
          error: 'Error al obtener los elementos' 
        });
      }
      res.json(results);
    });
  },

  getPersonasByElemento: (req, res) => {
    const { elementoId } = req.params;

    PersonaElemento.getPersonasByElemento(elementoId, (err, results) => {
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
    const { personaId, elementoId } = req.params;

    PersonaElemento.delete(personaId, elementoId, (err) => {
      if (err) {
        console.error('Error al eliminar relación:', err);
        return res.status(500).json({ 
          error: 'Error al eliminar la relación persona-elemento' 
        });
      }
      res.json({ 
        message: 'Relación persona-elemento eliminada exitosamente' 
      });
    });
  }
};

module.exports = personaElementoController;