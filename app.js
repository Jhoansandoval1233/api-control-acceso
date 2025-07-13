const express = require('express');
const app = express();
const cors = require('cors');
const controlAccesoRoutes = require('./routes/controlAccesoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const personaRoutes = require('./routes/personaRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const elementoRoutes = require('./routes/elementoRoutes');
const personaVehiculoRoutes = require('./routes/personaVehiculoRoutes');
const personaElementoRoutes = require('./routes/personaElementoRoutes');
const connection = require('./config/db');

// Ruta de prueba directa
app.get('/test', (req, res) => {
  console.log('Solicitud recibida en /test');
  res.send('Ruta de prueba directa funcionando');
}); 

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/control-acceso', controlAccesoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/vehiculo', vehiculoRoutes);
app.use('/api/elemento', elementoRoutes);
app.use('/api/persona-vehiculo', personaVehiculoRoutes);
app.use('/api/persona-elemento', personaElementoRoutes);

// Ruta de prueba para la base de datos
app.get('/api/test-db', (req, res) => {
  connection.query('SELECT 1 as test', (err, results) => {
    if (err) {
      console.error('Error en prueba de BD:', err);
      return res.status(500).json({ 
        status: 'error',
        message: 'Error de conexión a la base de datos',
        error: err.message 
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Conexión exitosa a la base de datos',
      data: results
    });
  });
});



// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


module.exports = app;