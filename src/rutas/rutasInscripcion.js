const express = require('express');
const router = express.Router();
const inscripcionControlador = require('../controladores/inscripcionControlador');

// Ruta para registrar una inscripción
router.post('/registrar', inscripcionControlador.registrarInscripcion);

// Ruta para listar todas las inscripciones
router.get('/listar', inscripcionControlador.listarInscripciones);

// Ruta para eliminar una inscripción por su ID
router.delete('/eliminar/:id_inscripcion', inscripcionControlador.eliminarInscripcion);

// Ruta para actualizar una inscripción por su ID
router.put('/actualizar/:id_inscripcion', inscripcionControlador.actualizarInscripcion);

// Ruta para buscar una inscripción por su ID
router.get('/buscar/:documento_est', inscripcionControlador.buscarInscripcionPorEstudiante);

module.exports = router;
