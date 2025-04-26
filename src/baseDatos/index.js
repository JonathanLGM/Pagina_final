require('dotenv').config();
const { Sequelize,DataTypes } = require('sequelize');

const defineEstudiante = require('../modelos/estudiante');
const defineMateria = require('../modelos/materia');
const defineProfesor = require('../modelos/profesor');
const defineInscripcion = require('../modelos/inscripcion');
const defineAsignacion = require('../modelos/asignacion');

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false // Para evitar mensajes de consola innecesarios
  }
);

const Estudiante = defineEstudiante(sequelize, DataTypes);
const Materia = defineMateria(sequelize, DataTypes);
const Profesor = defineProfesor(sequelize, DataTypes);
const Inscripcion = defineInscripcion(sequelize, DataTypes);
const Asignacion = defineAsignacion(sequelize, DataTypes);

sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

sequelize.sync({ alter: true, force: false })
.then(() => console.log('Sincronización completada.'))
.catch(err => console.error('Error en la sincronización:', err));

module.exports = {
  sequelize,
  Estudiante,
  Materia,
  Profesor,
  Inscripcion,
  Asignacion
};