const defineAsignacion = (sequelize, DataTypes) => {
    return sequelize.define('Asignacion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_materia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        documento_pro: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        fecha_asignacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'asignacion',
        timestamps: false
    });
};

module.exports = defineAsignacion;