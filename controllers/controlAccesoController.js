const ControlAcceso = require('../models/controlAccesoModels');
const Vehiculo = require('../models/vehiculoModel');
const Elemento = require('../models/elementoModel');
const db = require('../config/db');

const controlAccesoController = {
  getAll: (req, res) => {
    ControlAcceso.getAll((err, results) => {
      if (err) {
        console.error('Error al obtener registros:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al obtener los registros'
        });
      }

      const formattedResults = results.map(record => ({
        ...record,
        fecha_hora_ingreso: new Date(record.fecha_hora_ingreso)
          .toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'medium'
          }),
        fecha_hora_salida: record.fecha_hora_salida 
          ? new Date(record.fecha_hora_salida).toLocaleString('es-CO', {
              dateStyle: 'medium',
              timeStyle: 'medium'
            })
          : 'Pendiente'
      }));

      res.status(200).json({
        success: true,
        data: formattedResults,
        total: formattedResults.length
      });
    });
  },

  getByDocumento: (req, res) => {
    const { numero_documento } = req.params;
  
    ControlAcceso.getByDocumento(numero_documento, (err, results) => {
      if (err) {
        console.error('Error al buscar por documento:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al buscar registros por documento'
        });
      }
  
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron registros con ese documento'
        });
      }
  
      const formattedResults = results.map(record => ({
        ...record,
        fecha_hora_ingreso: new Date(record.fecha_hora_ingreso)
          .toLocaleString('es-CO', {
            dateStyle: 'medium',
            timeStyle: 'medium'
          }),
        fecha_hora_salida: record.fecha_hora_salida 
          ? new Date(record.fecha_hora_salida).toLocaleString('es-CO', {
              dateStyle: 'medium',
              timeStyle: 'medium'
            })
          : null
      }));
  
      res.status(200).json({
        success: true,
        data: formattedResults
      });
    });
  },

  create: async (req, res) => {
    let { persona_id, numero_documento, observaciones, vehiculo, elemento, tipo_movimiento } = req.body;
  
    try {
      // Buscar persona por número de documento si no se envía el ID
      if (!persona_id && numero_documento) {
        const personaResult = await new Promise((resolve, reject) => {
          const sql = 'SELECT id FROM personas WHERE numero_documento = ? LIMIT 1';
          db.query(sql, [numero_documento], (err, rows) => err ? reject(err) : resolve(rows));
        });
  
        if (personaResult.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Persona no encontrada con ese documento'
          });
        }
  
        persona_id = personaResult[0].id;
      }
  
      if (!persona_id) {
        return res.status(400).json({
          success: false,
          message: 'El ID de la persona es requerido'
        });
      }
  
      if (tipo_movimiento === 'salida') {
        const query = `
          SELECT id FROM registros 
          WHERE persona_id = ? AND fecha_hora_salida IS NULL 
          ORDER BY fecha_hora_ingreso DESC LIMIT 1
        `;
        db.query(query, [persona_id], (err, results) => {
          if (err) {
            console.error('Error al consultar último ingreso:', err);
            return res.status(500).json({
              success: false,
              message: 'Error al buscar registros pendientes'
            });
          }
  
          if (results.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'No hay entradas pendientes para esta persona'
            });
          }
  
          const registroId = results[0].id;
          ControlAcceso.updateSalida(registroId, (err, result) => {
            if (err) {
              console.error('Error al registrar salida:', err);
              return res.status(500).json({
                success: false,
                message: 'Error al registrar la salida'
              });
            }
  
            return res.status(200).json({
              success: true,
              message: 'Salida registrada correctamente'
            });
          });
        });
  
        return;
      }
  
      // Registrar entrada
      let vehiculoId = null;
      let elementoId = null;
  
      if (vehiculo && vehiculo.placa && vehiculo.tipo_vehiculo) {
        const vehiculoResult = await new Promise((resolve, reject) => {
          Vehiculo.create(vehiculo, (err, result) => err ? reject(err) : resolve(result));
        });
        vehiculoId = vehiculoResult.insertId;
      }
  
      if (elemento && elemento.tipo_elemento && elemento.serial) {
        const elementoResult = await new Promise((resolve, reject) => {
          Elemento.create(elemento, (err, result) => err ? reject(err) : resolve(result));
        });
        elementoId = elementoResult.insertId;
      }
  
      ControlAcceso.create({
        persona_id,
        observaciones,
        vehiculo_id: vehiculoId,
        elemento_id: elementoId
      }, (err, result) => {
        if (err) {
          console.error('Error al crear registro:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al crear el registro'
          });
        }
  
        res.status(201).json({
          success: true,
          message: 'Registro de entrada creado correctamente',
          id: result.insertId
        });
      });
  
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
,  

  delete: (req, res) => {
    const { id } = req.params;
    ControlAcceso.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar el registro' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.status(200).json({ message: 'Registro eliminado correctamente' });
    });
  }
};

module.exports = controlAccesoController;