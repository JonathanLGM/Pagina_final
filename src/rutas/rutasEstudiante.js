const express = require('express');
const router = express.Router();
const estudianteControlador = require('../controladores/estudianteControlador');

// Ruta para registrar un estudiante
router.post('/registrar', estudianteControlador.registrarEstudiante);

// Ruta para listar estudiantes
router.get('/listar', estudianteControlador.listarEstudiantes);

router.delete('/eliminar/:documento_est', estudianteControlador.eliminarEstudiante);

router.put('/actualizar/:documento_est',estudianteControlador.actualizarEstudiante);

router.get('/buscar/:documento_est', estudianteControlador.buscarEstudiantePorDocumento);

module.exports = router;