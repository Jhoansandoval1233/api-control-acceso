require('dotenv').config();
const app = require('./app');

app.use('/api/persona', require('./routes/personaRoutes'));

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => {
    process.exit(1);
  });
});