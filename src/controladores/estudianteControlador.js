const Joi = require('joi');
const { Estudiante } = require('../baseDatos');

// Validación con Joi
const validadorEstudiante = Joi.object({
  documento_est: Joi.string().min(8).max(15).required().messages({
    'string.base': 'El documento debe ser un texto.',
    'string.empty': 'El documento es obligatorio.',
    'string.min': 'El documento debe tener al menos {#limit} caracteres.',
    'string.max': 'El documento no puede tener más de {#limit} caracteres.',
    'any.required': 'El documento es un campo obligatorio.'
  }),
  nombre: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  }),
  apellido: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El apellido debe ser un texto.',
    'string.empty': 'El apellido es obligatorio.',
    'string.min': 'El apellido debe tener al menos {#limit} caracteres.',
    'string.max': 'El apellido no puede tener más de {#limit} caracteres.',
    'any.required': 'El apellido es un campo obligatorio.'
  }),
  correo: Joi.string().email().required().messages({
    'string.base': 'El correo debe ser un texto.',
    'string.empty': 'El correo es obligatorio.',
    'string.email': 'El correo debe ser un correo electrónico válido.',
    'any.required': 'El correo es un campo obligatorio.'
  }),
  celular: Joi.string().min(10).max(15).required().messages({
    'string.base': 'El celular debe ser un texto.',
    'string.empty': 'El celular es obligatorio.',
    'string.min': 'El celular debe tener al menos {#limit} caracteres.',
    'string.max': 'El celular no puede tener más de {#limit} caracteres.',
    'any.required': 'El celular es un campo obligatorio.'
  }),
  fecha_nacimiento: Joi.date().required().messages({
    'date.base': 'La fecha de nacimiento debe ser una fecha válida.',
    'any.required': 'La fecha de nacimiento es un campo obligatorio.'
  })
});

const registrarEstudiante = async (req, res) => {
  try {
    const { error } = validadorEstudiante.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          documento_est: '',
          nombre: '',
          apellido: '',
          correo: '',
          celular: '',
          fecha_nacimiento: '', 
          erroresValidacion: mensajesErrores
        }
      });
    }
    const { documento_est, nombre, apellido, correo,celular,fecha_nacimiento } = req.body;

    const estudianteExistente = await Estudiante.findOne({
      where: { documento_est }
    });

    if (estudianteExistente) {
      return res.status(400).json({
        mensaje: "El estudiante ya existe",
        resultado: null
      });
    }

    const nuevoEstudiante = await Estudiante.create({
      documento_est,
      nombre,
      apellido,
      correo,
      celular,
      fecha_nacimiento
    });

    res.status(201).json({
      mensaje: "Estudiante creado",
      resultado: {
        documento_est: nuevoEstudiante.documento_est,
        nombre: nuevoEstudiante.nombre,
        apellido: nuevoEstudiante.apellido,
        correo: nuevoEstudiante.correo,
        celular: nuevoEstudiante.celular,
        fecha_nacimiento: nuevoEstudiante.fecha_nacimiento,
        erroresValidacion: ''
      }
    });

  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.status(200).json({ mensaje: 'Estudiantes listados', resultado: estudiantes });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

const eliminarEstudiante = async (req, res) => {
  try {
    console.log('Documento recibido:', req.params.documento_est); 

    const { documento_est } = req.params;

    const estudiante = await Estudiante.findByPk(documento_est);

    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado', resultado: null });
    }

    await estudiante.destroy();

    res.status(200).json({ mensaje: 'Estudiante eliminado', resultado: estudiante });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

const validadorActualizarEstudiante = Joi.object({
  nombre: Joi.string().min(2).max(100).optional().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
  }),
  apellido: Joi.string().min(2).max(100).optional().messages({
    'string.base': 'El apellido debe ser un texto.',
    'string.min': 'El apellido debe tener al menos {#limit} caracteres.',
    'string.max': 'El apellido no puede tener más de {#limit} caracteres.',
  }),
  correo: Joi.string().email().optional().messages({
    'string.email': 'El correo debe ser un correo electrónico válido.',
  }),
  celular: Joi.string().min(10).max(16).optional().messages({
    'string.base': 'El celular debe ser un texto.',
    'string.min': 'El celular debe tener al menos {#limit} caracteres.',
    'string.max': 'El celular no puede tener más de {#limit} caracteres.',
  }),
  fecha_nacimiento: Joi.date().optional().messages({
    'date.base': 'La fecha de nacimiento debe ser una fecha válida.'
  })
});

const actualizarEstudiante = async (req, res) => {
  try {
    // Validar la información recibida
    const { error } = validadorActualizarEstudiante.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { documento_est } = req.params; // Suponiendo que el documento del estudiante se pasa como parámetro
    const { nombre, apellido, correo, celular, fecha_nacimiento } = req.body;

    // Buscar el estudiante en la base de datos
    const estudiante = await Estudiante.findByPk(documento_est);

    if (!estudiante) {
      return res.status(404).json({
        mensaje: 'Estudiante no encontrado',
        resultado: null
      });
    }

    // Actualizar solo los campos que han sido enviados en el body
    if (nombre) estudiante.nombre = nombre;
    if (apellido) estudiante.apellido = apellido;
    if (correo) estudiante.correo = correo;
    if (celular) estudiante.celular = celular;
    if (fecha_nacimiento) estudiante.fecha_nacimiento = fecha_nacimiento;

    // Guardar los cambios
    await estudiante.save();

    res.status(200).json({
      mensaje: 'Estudiante actualizado',
      resultado: {
        documento_est: estudiante.documento_est,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        correo: estudiante.correo,
        celular: estudiante.celular,
        fecha_nacimiento: estudiante.fecha_nacimiento
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

const buscarEstudiantePorDocumento = async (req, res) => {
  try {
    const { documento_est } = req.params;
    const estudiante = await Estudiante.findByPk(documento_est);

    if (!estudiante) {
      return res.status(404).json({
        mensaje: 'Estudiante no encontrado',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Estudiante encontrado',
      resultado: estudiante
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error del servidor',
      resultado: null
    });
  }
};

module.exports = {
  registrarEstudiante,
  listarEstudiantes,
  eliminarEstudiante,
  actualizarEstudiante,
  buscarEstudiantePorDocumento
};