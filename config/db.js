const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'acceso_porteria_bd',
  charset: 'utf8mb4'
});

connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Agregar promisify para manejar mejor las consultas
const util = require('util');
connection.query = util.promisify(connection.query);

module.exports = connection;