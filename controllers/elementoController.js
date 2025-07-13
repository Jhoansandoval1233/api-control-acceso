const Elemento = require('../models/elementoModel');

const elementoController = {
  getAll: (req, res) => {
    Elemento.getAll((err, results) => {
      if (err) {
        console.error('Error al obtener los elementos:', err);
        return res.status(500).json({ error: 'Error al obtener los elementos' });
      }
      res.json(results);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    Elemento.getById(id, (err, results) => {
      if (err) {
        console.error('Error al obtener el elemento:', err);
        return res.status(500).json({ error: 'Error al obtener el elemento' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Elemento no encontrado' });
      }
      res.json(results[0]);
    });
  },

  create: (req, res) => {
    console.log('Request body:', req.body);

    // Validar si el cuerpo de la solicitud está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            error: 'El cuerpo de la solicitud está vacío' 
        });
    }

    const { tipo_elemento, serial, observaciones } = req.body;

    // Validar campos requeridos
    if (!tipo_elemento || !serial) {
        return res.status(400).json({ 
            error: 'tipo_elemento y serial son campos requeridos',
            received: {
                tipo_elemento,
                serial,
                observaciones
            }
        });
    }

    const newElemento = {
        tipo_elemento,
        serial,
        observaciones: observaciones || null
    };

    Elemento.create(newElemento, (err, result) => {
        if (err) {
            console.error('Error al crear el elemento:', err);
            return res.status(500).json({ error: 'Error al crear el elemento' });
        }
        res.status(201).json({ 
            message: 'Elemento creado correctamente', 
            id: result.insertId,
            elemento: newElemento
        });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const updatedElemento = req.body;
    Elemento.update(id, updatedElemento, (err) => {
      if (err) {
        console.error('Error al actualizar el elemento:', err);
        return res.status(500).json({ error: 'Error al actualizar el elemento' });
      }
      res.json({ message: 'Elemento actualizado correctamente' });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    Elemento.delete(id, (err) => {
      if (err) {
        console.error('Error al eliminar el elemento:', err);
        return res.status(500).json({ error: 'Error al eliminar el elemento' });
      }
      res.json({ message: 'Elemento eliminado correctamente' });
    });
  }
};

module.exports = elementoController;
