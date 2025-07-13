const db = require('../config/db');

const Elemento = {
  getAll: (callback) => {
    db.query('SELECT * FROM elementos', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM elementos WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const { tipo_elemento, serial, observaciones } = data; 
    db.query(
      'INSERT INTO elementos (tipo_elemento, serial, observaciones) VALUES (?, ?, ?)',
      [tipo_elemento, serial, observaciones],
      callback
    );
  },

  update: (id, data, callback) => {
    const { tipo_elemento, serial, observaciones } = data; 
    db.query(
      'UPDATE elementos SET tipo_elemento = ?, serial = ?, observaciones = ? WHERE id = ?',
      [tipo_elemento, serial, observaciones, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM elementos WHERE id = ?', [id], callback);
  }
};

module.exports = Elemento;
