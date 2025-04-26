const Joi = require('joi');
const { Materia } = require('../baseDatos');

// Esquema de validación para registrar una materia
const validadorMateria = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo obligatorio.'
  }),
  horas_semana: Joi.number().integer().min(1).required().messages({
    'number.base': 'Las horas por semana deben ser un número.',
    'number.integer': 'Las horas por semana deben ser un número entero.',
    'number.min': 'Las horas por semana deben ser al menos {#limit}.',
    'any.required': 'Las horas por semana son obligatorias.'
  }),
  descripcion: Joi.string().allow('').max(1000).messages({
    'string.base': 'La descripción debe ser un texto.',
    'string.max': 'La descripción no puede tener más de {#limit} caracteres.'
  })
});

// Controlador para registrar una nueva materia
const registrarMateria = async (req, res) => {
  try {
    // Validación de entrada
    const { error } = validadorMateria.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          id_materia: '',
          nombre: '',
          horas_semana: '',
          descripcion: '',
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { nombre, horas_semana, descripcion } = req.body;

    // Verificar si ya existe una materia con el mismo nombre
    const materiaExistente = await Materia.findOne({ where: { nombre } });
    if (materiaExistente) {
      return res.status(400).json({
        mensaje: 'La materia ya existe',
        resultado: null
      });
    }

    // Crear nueva materia
    const nuevaMateria = await Materia.create({
      nombre,
      horas_semana,
      descripcion: descripcion || null
    });

    // Respuesta exitosa
    res.status(201).json({
      mensaje: 'Materia creada',
      resultado: {
        id_materia: nuevaMateria.id_materia,
        nombre: nuevaMateria.nombre,
        horas_semana: nuevaMateria.horas_semana,
        descripcion: nuevaMateria.descripcion,
        erroresValidacion: ''
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error del servidor: ' + error.message,
      resultado: null
    });
  }
};

const listarMaterias = async (req, res) => {
  try {
    const profesores = await Materia.findAll(); // Encuentra todos los profesores
    res.status(200).json({ mensaje: 'Materias listados', resultado: profesores });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

const eliminarMateria = async (req, res) => {
  try {
    console.log('id recibido:', req.params.id_materia); 

    const { id_materia } = req.params;

    const materia = await Materia.findByPk(id_materia);

    if (!materia) {
      return res.status(404).json({ mensaje: 'Materia no encontrado', resultado: null });
    }

    await materia.destroy();

    res.status(200).json({ mensaje: 'Materia eliminado', resultado: materia });
  } catch (error) {
    res.status(500).json({ mensaje: error.message, resultado: null });
  }
};

const validadorActualizarMateria = Joi.object({
  nombre: Joi.string().min(2).max(100).optional().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.'
  }),
  horas_semana: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Las horas por semana deben ser un número.',
    'number.min': 'Debe haber al menos {#limit} hora por semana.'
  }),
  descripcion: Joi.string().optional().allow(null, '').messages({
    'string.base': 'La descripción debe ser un texto.'
  })
});

const actualizarMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const { nombre, horas_semana, descripcion } = req.body;

    const materia = await Materia.findByPk(id_materia);

    if (!materia) {
      return res.status(404).json({
        mensaje: 'Materia no encontrada',
        resultado: null
      });
    }

    if (nombre !== undefined) materia.nombre = nombre;
    if (horas_semana !== undefined) materia.horas_semana = horas_semana;
    if (descripcion !== undefined) materia.descripcion = descripcion;

    await materia.save();

    res.status(200).json({
      mensaje: 'Materia actualizada correctamente',
      resultado: materia
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

const buscarMateriaPorId = async (req, res) => {
  try {
      const { id_materia } = req.params;
      const materia = await Materia.findByPk(id_materia);
      if (!materia) {
          return res.status(404).json({ mensaje: 'Materia no encontrada' });
      }
      res.json(materia);
  } catch (error) {
      res.status(500).json({ mensaje: 'Error al buscar la materia', error });
  }
};

module.exports = {
  registrarMateria,
  listarMaterias,
  eliminarMateria,
  actualizarMateria,
  buscarMateriaPorId
};
