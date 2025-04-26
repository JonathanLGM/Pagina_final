const Joi = require('joi');
const { Asignacion, Profesor, Materia } = require('../baseDatos');

// Validación con Joi
const validadorAsignacion = Joi.object({
  documento_pro: Joi.number().required().messages({
    'number.base': 'El documento del profesor debe ser un número.',
    'any.required': 'El documento del profesor es un campo obligatorio.'
  }),
  id_materia: Joi.number().required().messages({
    'number.base': 'El ID de la materia debe ser un número.',
    'any.required': 'El ID de la materia es un campo obligatorio.'
  }),
  fecha_asignacion: Joi.date().optional().messages({
    'date.base': 'La fecha de asignación debe tener un formato de fecha válido.'
  })
});

// Función para registrar una asignación
const registrarAsignacion = async (req, res) => {
  try {
    const { error } = validadorAsignacion.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { documento_pro, id_materia, fecha_asignacion } = req.body;

    // Verificar si el profesor y la materia existen
    const profesorExistente = await Profesor.findByPk(documento_pro);
    const materiaExistente = await Materia.findByPk(id_materia);

    if (!profesorExistente || !materiaExistente) {
      return res.status(400).json({
        mensaje: 'El profesor o la materia no existen',
        resultado: null
      });
    }

    const nuevaAsignacion = await Asignacion.create({
      documento_pro,
      id_materia,
      fecha_asignacion
    });

    res.status(201).json({
      mensaje: 'Asignación registrada',
      resultado: nuevaAsignacion
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// Función para listar todas las asignaciones
const listarAsignacion = async (req, res) => {
  try {
    const asignaciones = await Asignacion.findAll();
    res.status(200).json({
      mensaje: 'Asignaciones listadas',
      resultado: asignaciones
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// Función para eliminar una asignación
const eliminarAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    const asignacion = await Asignacion.findByPk(id_asignacion);

    if (!asignacion) {
      return res.status(404).json({
        mensaje: 'Asignación no encontrada',
        resultado: null
      });
    }

    await asignacion.destroy();
    res.status(200).json({
      mensaje: 'Asignación eliminada',
      resultado: asignacion
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// Función para actualizar una asignación
const actualizarAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    const { documento_pro, id_materia, fecha_asignacion } = req.body;

    const asignacion = await Asignacion.findByPk(id_asignacion);

    if (!asignacion) {
      return res.status(404).json({
        mensaje: 'Asignación no encontrada',
        resultado: null
      });
    }

    // Actualizar los campos de la asignación
    if (documento_pro) asignacion.documento_pro = documento_pro;
    if (id_materia) asignacion.id_materia = id_materia;
    if (fecha_asignacion) asignacion.fecha_asignacion = fecha_asignacion;

    await asignacion.save();

    res.status(200).json({
      mensaje: 'Asignación actualizada',
      resultado: asignacion
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

// Función para buscar una asignación por profesor
const buscarAsignacionPorProfesor = async (req, res) => {
  try {
    const { documento_pro } = req.params;
    const asignaciones = await Asignacion.findAll({
      where: { documento_pro }
    });

    if (!asignaciones.length) {
      return res.status(404).json({
        mensaje: 'No se encontraron asignaciones para este profesor',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Asignaciones encontradas',
      resultado: asignaciones
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error del servidor',
      resultado: null
    });
  }
};

module.exports = {
  registrarAsignacion,
  listarAsignacion,
  eliminarAsignacion,
  actualizarAsignacion,
  buscarAsignacionPorProfesor
};