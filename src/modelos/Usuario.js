// src/modelos/usuario.js

const defineUsuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: { // Cambiado de 'id' a 'id_usuario' para ser más explícito y evitar conflictos
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_usuario: { // Puede ser un nombre de usuario único o el correo electrónico
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "El nombre de usuario no puede estar vacío."
                }
            }
        },
        correo: { // Añadido campo correo si nombre_usuario no es el correo
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Debe proporcionar un correo electrónico válido."
                },
                notEmpty: {
                    msg: "El correo electrónico no puede estar vacío."
                }
            }
        },
        clave: {
            type: DataTypes.STRING, // Se almacena el hash, que puede ser largo
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La contraseña no puede estar vacía."
                }
            }
        },
        rol: {
            type: DataTypes.ENUM('admin', 'profesor', 'estudiante'), // Define los roles permitidos
            allowNull: false,
            defaultValue: 'estudiante', // Rol por defecto si no se especifica
            validate: {
                isIn: {
                    args: [['admin', 'profesor', 'estudiante']],
                    msg: "El rol especificado no es válido."
                }
            }
        },
        // Opcional: campos para vincular con las tablas Estudiante/Profesor si es necesario
        // documento_identidad: { // Podría ser documento_est o documento_pro
        //     type: DataTypes.STRING(20),
        //     allowNull: true, // Puede ser null si el admin no es ni estudiante ni profesor
        //     unique: true // Si se usa, debe ser único o manejar la lógica de que un usuario puede ser prof Y est
        // }
    }, {
        tableName: 'usuarios', // Nombre de la tabla en la base de datos
        timestamps: true // Agrega createdAt y updatedAt automáticamente
    });

    return Usuario;
};

module.exports = defineUsuario;