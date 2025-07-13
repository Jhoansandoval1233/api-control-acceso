const Persona = require('../models/personaModel');

// Obtener todas las personas
exports.getAll = (req, res) => {
  console.log('Solicitud GET recibida en /api/persona');

  Persona.getAll((err, results) => {
    if (err) {
      console.error('Error al obtener personas:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las personas'
      });
    }

    const formattedResults = results.map(person => ({
      ...person,
      fecha_registro: new Date(person.fecha_registro).toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      })
    }));

    res.status(200).json({
      success: true,
      data: formattedResults,
      total: formattedResults.length
    });
  });
};

// Obtener persona por ID
exports.getById = (req, res) => {
  const id = req.params.id;

  Persona.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });
    res.json(results[0]);
  });
};

// Buscar persona por documento
exports.getByDocumento = (req, res) => {
  const numero_documento = req.params.numero_documento;

  if (!numero_documento) {
    return res.status(400).json({ mensaje: 'El número de documento es requerido' });
  }

  Persona.findByDocumento(numero_documento, (err, results) => {
    if (err) {
      console.error('Error al buscar persona por documento:', err);
      return res.status(500).json({ error: 'Error al buscar persona' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: 'Persona no encontrada',
        existe: false
      });
    }

    res.json({
      mensaje: 'Persona encontrada',
      existe: true,
      persona: results[0]
    });
  });
};

// Crear persona
exports.create = (req, res) => {
  console.log('BODY RECIBIDO EN BACKEND:', req.body);
  const {
    nombre,
    apellido,
    tipo_documento,
    numero_documento,
    telefono,
    correo,
    tipo_rol
  } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !apellido || !tipo_documento || !numero_documento || !tipo_rol) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos obligatorios deben estar completos'
    });
  }

  Persona.findByDocumento(numero_documento, (err, results) => {
    if (err) {
      console.error('Error al verificar documento:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar si el documento ya existe'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El número de documento ya está registrado'
      });
    }

    Persona.create({
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      telefono: telefono || null,
      correo: correo || null,
      tipo_rol
    }, (createErr, result) => {
      if (createErr) {
        console.error('Error al crear persona:', createErr);
        return res.status(500).json({
          success: false,
          message: 'Error al registrar la persona'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Persona registrada exitosamente',
        id: result.insertId
      });
    });
  });
};

// Actualizar persona por documento
exports.update = (req, res) => {
  const numero_documento = req.params.numero_documento;
  const { nombre, apellido, tipo_documento, telefono, correo, tipo_rol } = req.body;

  if (!nombre || !apellido || !tipo_documento || !tipo_rol) {
    return res.status(400).json({
      mensaje: 'Faltan campos requeridos para actualizar'
    });
  }

  Persona.updateByDocumento(numero_documento, {
    nombre,
    apellido,
    tipo_documento,
    telefono: telefono || null,
    correo: correo || null,
    tipo_rol
  }, (err) => {
    if (err) {
      console.error('Error al actualizar persona:', err);
      return res.status(500).json({ error: err.message || 'Error al actualizar' });
    }

    res.json({ mensaje: 'Persona actualizada exitosamente' });
  });
};

// Eliminar (inactivar) persona
exports.delete = (req, res) => {
  const numero_documento = req.params.numero_documento;

  Persona.deleteByDocumento(numero_documento, (err) => {
    if (err) {
      console.error('Error al eliminar persona:', err);
      return res.status(500).json({ error: 'Error al eliminar persona' });
    }

    res.json({ mensaje: 'Persona eliminada (inactivada)' });
  });
};
