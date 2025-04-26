const express = require('express');
const router = express.Router();
const asignacionControlador = require('../controladores/asignacionControlador');

// Ruta para registrar una asignación de materia a un profesor
router.post('/registrar', asignacionControlador.registrarAsignacion);

// Ruta para listar todas las asignaciones
router.get('/listar', asignacionControlador.listarAsignacion);

// Ruta para eliminar una asignación por su ID
router.delete('/eliminar/:id_asignacion', asignacionControlador.eliminarAsignacion);

// Ruta para actualizar una asignación por su ID
router.put('/actualizar/:id_asignacion', asignacionControlador.actualizarAsignacion);

// Ruta para buscar asignaciones por el ID del profesor
router.get('/buscar/:documento_pro', asignacionControlador.buscarAsignacionPorProfesor);

module.exports = router;