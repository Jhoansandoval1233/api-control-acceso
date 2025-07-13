const db = require('../config/db');

const Persona = {
  // Crear nueva persona
  create: (data, callback) => {
    const sql = `
      INSERT INTO personas (
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        telefono,
        correo,
        tipo_rol
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.nombre,
      data.apellido,
      data.tipo_documento,
      data.numero_documento,
      data.telefono || null,
      data.correo || null,
      data.tipo_rol
    ];
    db.query(sql, values, callback);
  },

  // Obtener todas las personas activas
  getAll: (callback) => {
    const sql = `
      SELECT 
        id, nombre, apellido, tipo_documento, numero_documento,
        telefono, correo, tipo_rol, activo, fecha_registro
      FROM personas
      WHERE activo = 1
      ORDER BY fecha_registro DESC
    `;
    db.query(sql, callback);
  },

  // Buscar por número de documento
  findByDocumento: (numero_documento, callback) => {
    const sql = 'SELECT * FROM personas WHERE numero_documento = ?';
    db.query(sql, [numero_documento], callback);
  },

  // Actualizar persona por número de documento
  updateByDocumento: (numero_documento, data, callback) => {
    const sql = `
      UPDATE personas SET
        nombre = ?, 
        apellido = ?, 
        tipo_documento = ?,
        telefono = ?, 
        correo = ?, 
        tipo_rol = ?
      WHERE numero_documento = ?
    `;
    const values = [
      data.nombre,
      data.apellido,
      data.tipo_documento,
      data.telefono || null,
      data.correo || null,
      data.tipo_rol,
      numero_documento
    ];
    db.query(sql, values, callback);
  },

  // Inactivar persona
  deleteByDocumento: (numero_documento, callback) => {
    const sql = 'UPDATE personas SET activo = 0 WHERE numero_documento = ?';
    db.query(sql, [numero_documento], callback);
  }
};

module.exports = Persona;
