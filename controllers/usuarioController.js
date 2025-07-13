const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener usuario por ID
exports.getUsuarioById = (req, res) => {
  const id = req.params.id;
  Usuario.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result[0]);
  });
};

// Crear usuario desde endpoint directo (solo email, password, rol)
exports.createUsuario = async (req, res) => {
  const { email, password, rol } = req.body;

  if (!email || !password || !rol) {
    return res.status(400).json({
      error: 'Todos los campos son requeridos',
      received: { email: !!email, password: !!password, rol: !!rol }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  const rolesValidos = ['admin', 'usuario', 'guarda'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido', permitidos: rolesValidos, recibido: rol });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      email,
      password: hashedPassword,
      rol
    };

    Usuario.create(nuevoUsuario, (err, result) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        id: result.insertId,
        usuario: {
          email,
          rol
        }
      });
    });
  } catch (err) {
    console.error('Error en hashing o creación:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar usuario
exports.updateUsuario = (req, res) => {
  const id = req.params.id;
  const usuarioActualizado = req.body;
  Usuario.update(id, usuarioActualizado, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado' });
  });
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
  const id = req.params.id;
  Usuario.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
  }

  try {
    Usuario.getByEmail(email, async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Error al verificar credenciales' });
      if (!results || results.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      Usuario.updateLastAccess(user.id, () => {}); // no bloqueante

      res.json({
        success: true,
        message: 'Login exitoso',
        token: 'abc123', // ⚠️ Reemplazar por JWT en producción
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol
        }
      });
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Registro completo con validación
exports.registro = async (req, res) => {
  const { nombre, apellido, numero_documento, telefono, email, rol, password } = req.body;

  if (!nombre || !apellido || !numero_documento || !email || !rol || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos marcados con * son obligatorios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Formato de email inválido' });
  }

  const rolesPermitidos = ['admin', 'guarda'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ success: false, message: 'Rol no válido', rolesPermitidos });
  }

  try {
    Usuario.getByEmail(email, async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Error al verificar email' });
      if (results.length > 0) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        email,
        password: hashedPassword,
        rol,
        nombre,
        apellido,
        numero_documento,
        telefono
      };

      Usuario.create(userData, (createErr, result) => {
        if (createErr) return res.status(500).json({ success: false, message: 'Error al crear el usuario' });

        res.status(201).json({
          success: true,
          message: 'Usuario registrado exitosamente',
          userId: result.insertId
        });
      });
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Restablecer contraseña
exports.restablecerContrasena = async (req, res) => {
  const { documento, nombre, nuevaContrasena } = req.body;

  if (!documento || !nombre || !nuevaContrasena) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: documento, nombre y nueva contraseña.' });
  }

  try {
    Usuario.getByDocumentoNombre(documento, nombre, async (err, results) => {
      if (err) return res.status(500).json({ message: 'Error al buscar usuario en la base de datos' });
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado con los datos proporcionados' });
      }

      const usuario = results[0];
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

      Usuario.updatePassword(usuario.id, hashedPassword, (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ message: 'Error al actualizar la contraseña del usuario' });
        }

        res.json({ message: 'Contraseña restablecida correctamente' });
      });
    });
  } catch (error) {
    console.error('[RestablecerContraseña] Error inesperado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
