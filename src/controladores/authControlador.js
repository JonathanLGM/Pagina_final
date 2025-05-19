// src/controladores/authControlador.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Usuario } = require('../baseDatos'); // Importamos el modelo Usuario

// Esquema de validación para el registro de usuarios con Joi
const schemaRegistro = Joi.object({
    nombre_usuario: Joi.string().min(3).max(100).required().messages({
        'string.base': 'El nombre de usuario debe ser un texto.',
        'string.empty': 'El nombre de usuario es obligatorio.',
        'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres.',
        'string.max': 'El nombre de usuario no puede tener más de {#limit} caracteres.',
        'any.required': 'El nombre de usuario es obligatorio.'
    }),
    correo: Joi.string().email().required().messages({
        'string.base': 'El correo debe ser un texto.',
        'string.empty': 'El correo es obligatorio.',
        'string.email': 'Debe proporcionar un correo electrónico válido.',
        'any.required': 'El correo es obligatorio.'
    }),
    clave: Joi.string().min(6).required().messages({ // Mínimo 6 caracteres para la contraseña
        'string.base': 'La contraseña debe ser un texto.',
        'string.empty': 'La contraseña es obligatoria.',
        'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
        'any.required': 'La contraseña es obligatoria.'
    }),
    rol: Joi.string().valid('admin', 'profesor', 'estudiante').optional().default('estudiante').messages({
        'any.only': 'El rol debe ser uno de los siguientes: admin, profesor, estudiante.'
    })
    // Podrías añadir 'documento_identidad' aquí si lo vas a manejar en el registro
});

// Esquema de validación para el login con Joi
const schemaLogin = Joi.object({
    // El usuario puede loguearse con nombre_usuario o correo
    login: Joi.string().required().messages({ // 'login' puede ser nombre_usuario o correo
        'string.empty': 'El nombre de usuario o correo es obligatorio.',
        'any.required': 'El nombre de usuario o correo es obligatorio.'
    }),
    clave: Joi.string().required().messages({
        'string.empty': 'La contraseña es obligatoria.',
        'any.required': 'La contraseña es obligatoria.'
    })
});


// --- REGISTRAR UN NUEVO USUARIO ---
const registrarUsuario = async (req, res) => {
    // 1. Validar los datos de entrada
    const { error, value } = schemaRegistro.validate(req.body, { abortEarly: false });
    if (error) {
        const mensajesErrores = error.details.map(detail => detail.message).join('|');
        return res.status(400).json({
            mensaje: "Errores en la validación de los datos.",
            errores: mensajesErrores
        });
    }

    const { nombre_usuario, correo, clave, rol } = value;

    try {
        // 2. Verificar si el nombre_usuario o correo ya existen
        const usuarioExistentePorNombre = await Usuario.findOne({ where: { nombre_usuario } });
        if (usuarioExistentePorNombre) {
            return res.status(400).json({ mensaje: "El nombre de usuario ya está en uso." });
        }
        const usuarioExistentePorCorreo = await Usuario.findOne({ where: { correo } });
        if (usuarioExistentePorCorreo) {
            return res.status(400).json({ mensaje: "El correo electrónico ya está registrado." });
        }

        // 3. Hashear la contraseña
        const salt = await bcrypt.genSalt(10); // Genera un salt con 10 rondas
        const claveHasheada = await bcrypt.hash(clave, salt);

        // 4. Crear el nuevo usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            nombre_usuario,
            correo,
            clave: claveHasheada,
            rol // rol viene validado y con default de Joi
        });

        // 5. Generar un token JWT para el nuevo usuario (opcional, pero bueno para auto-login)
        const payload = {
            usuario: {
                id: nuevoUsuario.id_usuario,
                rol: nuevoUsuario.rol,
                nombre_usuario: nuevoUsuario.nombre_usuario
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Necesitarás una JWT_SECRET en tu .env
            { expiresIn: '1h' }, // El token expira en 1 hora (puedes cambiarlo)
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    mensaje: "Usuario registrado exitosamente.",
                    token, // Devolvemos el token para que el frontend pueda usarlo
                    usuario: { // Devolvemos información básica del usuario (sin la clave)
                        id_usuario: nuevoUsuario.id_usuario,
                        nombre_usuario: nuevoUsuario.nombre_usuario,
                        correo: nuevoUsuario.correo,
                        rol: nuevoUsuario.rol,
                        createdAt: nuevoUsuario.createdAt
                    }
                });
            }
        );

    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).json({ mensaje: "Error del servidor al registrar el usuario.", detalle: err.message });
    }
};


// --- LOGIN DE USUARIO ---
const loginUsuario = async (req, res) => {
    // 1. Validar los datos de entrada
    const { error, value } = schemaLogin.validate(req.body, { abortEarly: false });
    if (error) {
        const mensajesErrores = error.details.map(detail => detail.message).join('|');
        return res.status(400).json({
            mensaje: "Errores en la validación de los datos.",
            errores: mensajesErrores
        });
    }

    const { login, clave } = value; // 'login' puede ser nombre_usuario o correo

    try {
        // 2. Buscar al usuario por nombre_usuario o correo
        let usuario = await Usuario.findOne({ where: { nombre_usuario: login } });
        if (!usuario) {
            usuario = await Usuario.findOne({ where: { correo: login } });
        }

        if (!usuario) {
            return res.status(400).json({ mensaje: "Credenciales inválidas (usuario no encontrado)." });
        }

        // 3. Comparar la contraseña ingresada con la almacenada (hasheada)
        const esClaveCorrecta = await bcrypt.compare(clave, usuario.clave);
        if (!esClaveCorrecta) {
            return res.status(400).json({ mensaje: "Credenciales inválidas (contraseña incorrecta)." });
        }

        // 4. Si las credenciales son correctas, generar un token JWT
        const payload = {
            usuario: {
                id: usuario.id_usuario,
                rol: usuario.rol,
                nombre_usuario: usuario.nombre_usuario
                // Puedes añadir más información al payload si es necesario, pero mantenlo ligero
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Necesitarás una JWT_SECRET en tu .env
            { expiresIn: '1h' }, // El token expira en 1 hora (puedes cambiarlo a '7d', '30m', etc.)
            (err, token) => {
                if (err) throw err;
                res.json({
                    mensaje: "Login exitoso.",
                    token,
                    usuario: { // Devolvemos información básica del usuario (sin la clave)
                        id_usuario: usuario.id_usuario,
                        nombre_usuario: usuario.nombre_usuario,
                        correo: usuario.correo,
                        rol: usuario.rol
                    }
                });
            }
        );

    } catch (err) {
        console.error("Error en el login:", err);
        res.status(500).json({ mensaje: "Error del servidor durante el login.", detalle: err.message });
    }
};


module.exports = {
    registrarUsuario,
    loginUsuario
};