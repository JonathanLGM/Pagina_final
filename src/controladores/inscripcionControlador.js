const Joi = require('joi');
const { Inscripcion, Estudiante, Materia } = require('../baseDatos');

// Validación con Joi para inscripciones
const validadorInscripcion = Joi.object({
  documento_est: Joi.string().min(8).max(15).required().messages({
    'string.base': 'El documento del estudiante debe ser un texto.',
    'string.empty': 'El documento del estudiante es obligatorio.',
    'string.min': 'El documento debe tener al menos {#limit} caracteres.',
    'string.max': 'El documento no puede tener más de {#limit} caracteres.',
    'any.required': 'El documento es un campo obligatorio.'
  }),
  id_materia: Joi.string().required().messages({
    'string.base': 'El ID de la materia debe ser un texto.',
    'string.empty': 'El ID de la materia es obligatorio.',
    'any.required': 'El ID de la materia es un campo obligatorio.'
  }),
  fecha: Joi.date().required().messages({
    'date.base': 'La fecha debe ser una fecha válida.',
    'any.required': 'La fecha es un campo obligatorio.'
  })
});

const registrarInscripcion = async (req, res) => {
  try {
    const { error } = validadorInscripcion.validate(req.body, { abortEarly: false });

    if (error) {
      const mensajesErrores = error.details.map(detail => detail.message).join('|');
      return res.status(400).json({
        mensaje: 'Errores en la validación',
        resultado: {
          documento_est: '',
          id_materia: '',
          erroresValidacion: mensajesErrores
        }
      });
    }

    const { documento_est, id_materia, fecha } = req.body;

    const estudiante = await Estudiante.findByPk(documento_est);
    if (!estudiante) {
      return res.status(404).json({
        mensaje: "Estudiante no encontrado",
        resultado: null
      });
    }

    const materia = await Materia.findByPk(id_materia);
    if (!materia) {
      return res.status(404).json({
        mensaje: "Materia no encontrada",
        resultado: null
      });
    }

    const inscripcionExistente = await Inscripcion.findOne({
      where: { documento_est, id_materia }
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        mensaje: "El estudiante ya está inscrito en esta materia",
        resultado: null
      });
    }

    const nuevaInscripcion = await Inscripcion.create({
      documento_est,
      id_materia,
      fecha
    });

    res.status(201).json({
      mensaje: "Inscripción registrada",
      resultado: {
        documento_est: nuevaInscripcion.documento_est,
        id_materia: nuevaInscripcion.id_materia,
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

const listarInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll();
    res.status(200).json({
      mensaje: 'Inscripciones listadas',
      resultado: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

const eliminarInscripcion = async (req, res) => {
    try {
      const { id_inscripcion } = req.params;  // Extrae id_inscripcion de los parámetros de la URL
  
      // Buscar la inscripción usando el id_inscripcion
      const inscripcion = await Inscripcion.findByPk(id_inscripcion);
  
      if (!inscripcion) {
        return res.status(404).json({
          mensaje: 'Inscripción no encontrada',
          resultado: null
        });
      }
  
      // Eliminar la inscripción
      await inscripcion.destroy();
  
      res.status(200).json({
        mensaje: 'Inscripción eliminada correctamente',
        resultado: inscripcion
      });
    } catch (error) {
      res.status(500).json({
        mensaje: error.message,
        resultado: null
      });
    }
  };

  const validadorActualizarInscripcion = Joi.object({
    documento_est: Joi.string().optional().messages({
      'string.base': 'El documento del estudiante debe ser un texto.',
    }),
    id_materia: Joi.string().optional().messages({
      'string.base': 'El ID de la materia debe ser un texto.',
      'any.required': 'El ID de la materia es obligatorio.'
    })
  });
  
  const actualizarInscripcion = async (req, res) => {
    try {
      const { error } = validadorActualizarInscripcion.validate(req.body, { abortEarly: false });
  
      if (error) {
        const mensajesErrores = error.details.map(detail => detail.message).join('|');
        return res.status(400).json({
          mensaje: 'Errores en la validación',
          resultado: {
            erroresValidacion: mensajesErrores
          }
        });
      }
  
      const { id_inscripcion } = req.params;  // Obtener ID de inscripción desde los parámetros
      const { documento_est, id_materia } = req.body;  // Obtener los datos del cuerpo de la solicitud
  
      // Buscar la inscripción por el ID de inscripción
      const inscripcion = await Inscripcion.findByPk(id_inscripcion);
  
      if (!inscripcion) {
        return res.status(404).json({
          mensaje: 'Inscripción no encontrada',
          resultado: null
        });
      }
  
      // Si documento_est es proporcionado, se actualiza (si no, no se toca)
      if (documento_est) {
        inscripcion.documento_est = documento_est;
      }
  
      // Si id_materia es proporcionado, se actualiza
      if (id_materia) {
        inscripcion.id_materia = id_materia;
      }
  
      // Guardar los cambios
      await inscripcion.save();
  
      res.status(200).json({
        mensaje: 'Inscripción actualizada correctamente',
        resultado: {
          id_inscripcion: inscripcion.id,
          documento_est: inscripcion.documento_est,
          id_materia: inscripcion.id_materia
        }
      });
    } catch (error) {
      res.status(500).json({
        mensaje: error.message,
        resultado: null
      });
    }
  };
  

const buscarInscripcionPorEstudiante = async (req, res) => {
  try {
    const { documento_est } = req.params;
    const inscripciones = await Inscripcion.findAll({
      where: { documento_est }
    });

    if (!inscripciones.length) {
      return res.status(404).json({
        mensaje: 'No se encontraron inscripciones para este estudiante',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Inscripciones encontradas',
      resultado: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
      resultado: null
    });
  }
};

module.exports = {
  registrarInscripcion,
  listarInscripciones,
  eliminarInscripcion,
  actualizarInscripcion,
  buscarInscripcionPorEstudiante
};