const db = require('../config/db');
const bcrypt = require('bcrypt');

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

    create: async (data, callback) => {
        try {
            // Validación de campos
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

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(data.password, 10); // 10 salt rounds

            const sql = `
                INSERT INTO usuarios (
                    email,
                    password,
                    rol,
                    nombre,
                    apellido,
                    numero_documento,
                    telefono
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                data.email.toLowerCase(),
                hashedPassword,
                data.rol,
                data.nombre,
                data.apellido,
                data.numero_documento,
                data.telefono || null
            ];

            console.log('Creando usuario con:', {
                email: data.email,
                rol: data.rol,
                nombre: data.nombre,
                apellido: data.apellido,
                numero_documento: data.numero_documento,
                telefono: data.telefono,
                password: '[HASHED]'
            });

            db.query(sql, values, (error, results) => {
                if (error) {
                    console.error('Error al crear usuario:', error);
                    return callback(error);
                }
                callback(null, results);
            });
        } catch (error) {
            console.error('Error interno en create:', error);
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
