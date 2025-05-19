// src/baseDatos/index.js

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Definiciones de los modelos
const defineEstudiante = require('../modelos/estudiante');
const defineMateria = require('../modelos/materia');
const defineProfesor = require('../modelos/profesor');
const defineInscripcion = require('../modelos/inscripcion');
const defineAsignacion = require('../modelos/asignacion');
const defineUsuario = require('../modelos/usuario'); // Modelo de Usuario añadido

// Configuración de la conexión Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos desde .env
  process.env.DB_USER,      // Usuario de la base de datos desde .env
  process.env.DB_PASSWORD,  // Contraseña de la base de datos desde .env
  {
    host: process.env.DB_HOST,        // Host de la base de datos desde .env
    port: process.env.DB_PORT,        // Puerto de la base de datos desde .env
    dialect: process.env.DB_DIALECT,  // Dialecto de la base de datos (ej: 'postgres', 'mysql') desde .env
    logging: false // Desactiva los logs de SQL en la consola para no saturar. Puedes ponerlo a `console.log` para debug.
  }
);

// Inicialización de los modelos
const Estudiante = defineEstudiante(sequelize, DataTypes);
const Materia = defineMateria(sequelize, DataTypes);
const Profesor = defineProfesor(sequelize, DataTypes);
const Inscripcion = defineInscripcion(sequelize, DataTypes);
const Asignacion = defineAsignacion(sequelize, DataTypes);
const Usuario = defineUsuario(sequelize, DataTypes); // Modelo Usuario inicializado

// --- OPCIONAL PERO RECOMENDADO: Definir Asociaciones ---
// Aquí es donde definirías las relaciones entre tus tablas si fueran necesarias.
// Por ejemplo, si un Usuario puede ser un Estudiante o un Profesor.
// Usuario.hasOne(Estudiante, { foreignKey: 'id_usuario_fk', /* ...otras opciones... */ });
// Estudiante.belongsTo(Usuario, { foreignKey: 'id_usuario_fk', /* ...otras opciones... */ });
//
// Usuario.hasOne(Profesor, { foreignKey: 'id_usuario_fk', /* ...otras opciones... */ });
// Profesor.belongsTo(Usuario, { foreignKey: 'id_usuario_fk', /* ...otras opciones... */ });
//
// Por ahora, mantenemos los modelos separados y el modelo Usuario es genérico.
// La vinculación lógica entre un Usuario y un Estudiante/Profesor se puede manejar
// a nivel de aplicación si es necesario, o añadiendo un campo como 'documento_identidad'
// en el modelo Usuario que corresponda al 'documento_est' o 'documento_pro'.

// Autenticar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida exitosamente.');
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

// Sincronizar todos los modelos definidos con la base de datos
// { alter: true } intentará modificar las tablas existentes para que coincidan con los modelos.
// Es útil durante el desarrollo, pero úsalo con precaución en producción.
// { force: false } (default si se omite) asegura que no se borren las tablas si ya existen.
// Usar `force: true` borrará y recreará las tablas (¡PÉRDIDA DE DATOS!). Útil solo en etapas muy tempranas de desarrollo.
sequelize.sync({ alter: true }) // Usamos alter:true para que intente actualizar las tablas
  .then(() => {
    console.log('Todos los modelos fueron sincronizados exitosamente con la base de datos.');
    console.log('La tabla "usuarios" debería estar creada o actualizada si ya existía.');
  })
  .catch(err => {
    console.error('Error al sincronizar los modelos con la base de datos:', err);
  });

// Exportar la instancia de sequelize y los modelos para usarlos en otras partes de la aplicación
module.exports = {
  sequelize,    // La instancia de Sequelize
  Estudiante,
  Materia,
  Profesor,
  Inscripcion,
  Asignacion,
  Usuario       // Modelo Usuario exportado
};