// Definición del modelo Materia
const defineMateria = (sequelize, DataTypes) => {
    return sequelize.define('Materia', {
      id_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      horas_semana: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'materia',
      timestamps: false,
    });
  };
  
  module.exports = defineMateria;