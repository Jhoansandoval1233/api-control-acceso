const db = require('../config/db');

const Usuario = {
    getAll: (callback) => {
        const sql = 'SELECT id, email, rol, fecha_creacion, ultimo_acceso FROM usuarios';
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = 'SELECT id, email, rol, fecha_creacion, ultimo_acceso FROM usuarios WHERE id = ?';
        db.query(sql, [id], callback);
    },

    getByEmail: (email, callback) => {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(sql, [email.toLowerCase()], callback);
    },

    getByDocumento: (numero_documento, callback) => {
        const sql = 'SELECT * FROM usuarios WHERE numero_documento = ?';
        db.query(sql, [numero_documento], callback);
    },

    create: (data, callback) => {
        try {
            // Validación de campos obligatorios
            if (!data.email || !data.password || !data.nombre || !data.apellido || !data.numero_documento) {
                return callback(new Error('Faltan campos requeridos'));
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return callback(new Error('Correo inválido'));
            }

            const rolesValidos = ['admin', 'usuario', 'guarda'];
            if (!rolesValidos.includes(data.rol)) {
                return callback(new Error('Rol inválido'));
            }

            // Validar si el correo ya existe
            Usuario.getByEmail(data.email, (err, result) => {
                if (err) return callback(err);
                if (result && result.length > 0) return callback(new Error('El correo ya está registrado'));

                // Validar si el documento ya existe
                Usuario.getByDocumento(data.numero_documento, (err2, result2) => {
                    if (err2) return callback(err2);
                    if (result2 && result2.length > 0) return callback(new Error('El número de documento ya está registrado'));

                    // Inserta contraseña ya hasheada desde el controller
                    const sql = `
                        INSERT INTO usuarios (
                            email,
                            password,
                            rol,
                            nombre,
                            apellido,
                            numero_documento,
                            telefono,
                            activo
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const values = [
                        data.email.toLowerCase(),
                        data.password,      // recibe el hash desde el controller
                        data.rol,
                        data.nombre,
                        data.apellido,
                        data.numero_documento,
                        data.telefono || null,
                        1 // activo por defecto
                    ];

                    db.query(sql, values, (error, results) => {
                        if (error) {
                            console.error('Error al crear usuario:', error.sqlMessage || error);
                            return callback(error);
                        }
                        callback(null, results);
                    });
                });
            });
        } catch (error) {
            console.error('Error interno en create:', error.message);
            callback(error);
        }
    },

    updateLastAccess: (userId, callback) => {
        const sql = 'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [userId], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM usuarios WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) {
                console.error('Error al eliminar usuario:', error);
                return callback(error);
            }
            callback(null, results);
        });
    },

    getByDocumentoNombre: (documento, nombre, callback) => {
        const sql = `
            SELECT * FROM usuarios 
            WHERE numero_documento = ? 
            AND CONCAT(nombre, ' ', apellido) LIKE ?
        `;
        db.query(sql, [documento, `%${nombre}%`], callback);
    },

    updatePassword: async (userId, newPassword, callback) => {
        const bcrypt = require('bcrypt');
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const sql = 'UPDATE usuarios SET password = ? WHERE id = ?';
            db.query(sql, [hashedPassword, userId], callback);
        } catch (error) {
            console.error('Error al hashear nueva contraseña:', error);
            callback(error);
        }
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE usuarios SET 
                email = ?, 
                rol = ?, 
                nombre = ?, 
                apellido = ?, 
                numero_documento = ?, 
                telefono = ?
            WHERE id = ?
        `;
        const values = [
            data.email,
            data.rol,
            data.nombre,
            data.apellido,
            data.numero_documento,
            data.telefono,
            id
        ];
        db.query(sql, values, callback);
    }
};

module.exports = Usuario;
