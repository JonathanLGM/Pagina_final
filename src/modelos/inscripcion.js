const defineInscripcion = (sequelize, DataTypes) => {
    return sequelize.define('Inscripcion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        documento_est: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        id_materia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'inscripcion',
        timestamps: false
    });
};

module.exports = defineInscripcion;