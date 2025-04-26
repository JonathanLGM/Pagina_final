const defineProfesor = (sequelize, DataTypes) => {
    return sequelize.define('Profesor', {
        documento_pro: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        especializacion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            //unique: true lo comente porque me aparecio el error Error: Too many keys specified; max 64 keys allowed supongo yo que cada que ejecuto la base de datos crea un indice nuevo en correo
        }
    }, {
        tableName: 'profesor',
        timestamps: false
    });
};

module.exports = defineProfesor;