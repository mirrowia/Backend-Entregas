const mongoose = require('mongoose');
const config = require('./config/config'); // Asegúrate de tener un archivo config.js con tus configuraciones

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

module.exports = db;