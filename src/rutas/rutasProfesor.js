const express = require('express');
const router = express.Router();
const profesorControlador = require('../controladores/profesorControlador');

// Corrige las rutas para que coincidan con el prefijo /api/profesores
router.post('/registrar', profesorControlador.registrarProfesor); // POST /api/profesores/registrar

router.get('/listar', profesorControlador.listarProfesores); // GET /api/profesores/listar

router.delete('/eliminar/:documento_pro', profesorControlador.eliminarProfesor);

router.put('/actualizar/:documento_pro', profesorControlador.actualizarProfesor);

router.get('/buscar/:documento_pro', profesorControlador.buscarProfesorPorDocumento); // GET /api/profesores/buscar

module.exports = router;
