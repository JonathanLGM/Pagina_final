const defineEstudiante = (sequelize, DataTypes) => {
    return sequelize.define('Estudiante', {
        documento_est: {
            type: DataTypes.STRING(20),  // Aumenté el tamaño para consistencia
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            //unique: true,
            validate: {
                isEmail: true
            }
        },
        celular: {
            type: DataTypes.STRING(16),
            allowNull: false,  // Cambiado para coincidir con Joi
            validate: {
                notEmpty: true
            }
        },
        fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'estudiante',  // Nombre en plural
        timestamps: true  // O false si tu tabla no tiene estos campos
    });
};

module.exports = defineEstudiante;