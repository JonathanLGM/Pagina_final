const Joi = require('joi');
const { Profesor } = require('../baseDatos');

const validadorProfesor = Joi.object({
  documento_pro: Joi.string().min(6).max(20).required().messages({
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
  especializacion: Joi.string().min(2).max(50).required().messages({
    'string.base': 'La especialización debe ser un texto.',
    'string.empty': 'La especialización es obligatoria.',
    'string.min': 'La especialización debe tener al menos {#limit} caracteres.',
    'string.max': 'La especialización no puede tener más de {#limit} caracteres.',
    'any.required': 'La especialización es un campo obligatorio.'
  }),
  correo: Joi.string().email().required().messages({
    'string.base': 'El correo debe ser un texto.',
    'string.empty': 'El correo es obligatorio.',
    'string.email': 'El correo debe ser un correo electrónico válido.',
    'any.required': 'El correo es un campo obligatorio.'
  })
});

const registrarProfesor = async (req, res) => {
  try {
    const { error } = validadorProfesor.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          documento_pro: '',
          nombre: '',
          apellido: '',
          especializacion: '',
          correo: '',
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { documento_pro, nombre, apellido, especializacion, correo } = req.body;

    const profesorExistente = await Profesor.findOne({
      where: { documento_pro }
    });

    if (profesorExistente) {
      return res.status(400).json({
        mensaje: "El profesor ya existe",
        resultado: null
      });
    }

    const nuevoProfesor = await Profesor.create({
      documento_pro,
      nombre,
      apellido,
      especializacion,
      correo
    });

    res.status(201).json({
      mensaje: "Profesor creado",
      resultado: {
        documento_pro: nuevoProfesor.documento_pro,
        nombre: nuevoProfesor.nombre,
        apellido: nuevoProfesor.apellido,
        especializacion: nuevoProfesor.especializacion,
        correo: nuevoProfesor.correo,
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

const listarProfesores = async (req, res) => {
  try {
    const profesores = await Profesor.findAll(); // Encuentra todos los profesores
    res.status(200).json({ mensaje: 'Profesores listados', resultado: profesores });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

const eliminarProfesor = async (req, res) => {
  try {
    console.log('Documento recibido:', req.params.documento_pro); // 👈

    const { documento_pro } = req.params;

    const profesor = await Profesor.findByPk(documento_pro);

    if (!profesor) {
      return res.status(404).json({ mensaje: 'Profesor no encontrado', resultado: null });
    }

    await profesor.destroy();

    res.status(200).json({ mensaje: 'Profesor eliminado', resultado: profesor });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

// Validación con Joi para el actualizar Profesor
const validadorActualizarProfesor = Joi.object({
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
  especializacion: Joi.string().min(2).max(100).optional().messages({
    'string.base': 'La especialización debe ser un texto.',
    'string.min': 'La especialización debe tener al menos {#limit} caracteres.',
    'string.max': 'La especialización no puede tener más de {#limit} caracteres.',
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

const actualizarProfesor = async (req, res) => {
  try {
    // Validar la información recibida
    const { error } = validadorActualizarProfesor.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { documento_pro } = req.params; // Suponiendo que el documento del profesor se pasa como parámetro
    const { nombre, apellido, especializacion, correo, celular, fecha_nacimiento } = req.body;

    // Buscar el profesor en la base de datos
    const profesorExistente = await Profesor.findByPk(documento_pro);

    if (!profesorExistente) {
      return res.status(404).json({
        mensaje: 'Profesor no encontrado',
        resultado: null
      });
    }

    // Actualizar solo los campos que han sido enviados en el body
    if (nombre) profesorExistente.nombre = nombre;
    if (apellido !== undefined) profesorExistente.apellido = apellido; // Chequear que no sea undefined
    if (especializacion !== undefined) profesorExistente.especializacion = especializacion;
    if (correo !== undefined) profesorExistente.correo = correo;
    if (celular !== undefined) profesorExistente.celular = celular;
    if (fecha_nacimiento !== undefined) profesorExistente.fecha_nacimiento = fecha_nacimiento;

    // Guardar los cambios
    await profesorExistente.save();

    res.status(200).json({
      mensaje: 'Profesor actualizado',
      resultado: {
        documento_pro: profesorExistente.documento_pro,
        nombre: profesorExistente.nombre,
        apellido: profesorExistente.apellido,
        especializacion: profesorExistente.especializacion,
        correo: profesorExistente.correo,
        celular: profesorExistente.celular,
        fecha_nacimiento: profesorExistente.fecha_nacimiento
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

const buscarProfesorPorDocumento = async (req, res) => {
  try {
    const { documento_pro } = req.params;
    const profesor = await Profesor.findByPk(documento_pro);

    if (!profesor) {
      return res.status(404).json({
        mensaje: 'Profesor no encontrado',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Profesor encontrado',
      resultado: profesor
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error del servidor',
      resultado: null
    });
  }
};

module.exports = {
  registrarProfesor,
  listarProfesores,
  eliminarProfesor,
  actualizarProfesor,
  buscarProfesorPorDocumento
};