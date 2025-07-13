const db = require('../config/db');

const Vehiculo = {
    getAll: (callback) => {
        db.query('SELECT * FROM vehiculos', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM vehiculos WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        const { placa, tipo_vehiculo, persona_id } = data;
    
        // Validar que los campos requeridos existan
        if (!placa || !tipo_vehiculo || !persona_id) {
            const error = new Error('Placa, tipo_vehiculo y persona_id son requeridos');
            return callback(error);
        }
    
        const sql = 'INSERT INTO vehiculos (placa, tipo_vehiculo, persona_id) VALUES (?, ?, ?)';
        const values = [
            placa.substring(0, 10), // Asegurar máximo 10 caracteres
            tipo_vehiculo.toLowerCase(),
            parseInt(persona_id)
        ];
    
        console.log('SQL Query:', sql);
        console.log('Values:', values);
    
        db.query(sql, values, callback);
    },
};

module.exports = Vehiculo;