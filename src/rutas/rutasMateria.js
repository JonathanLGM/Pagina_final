const express = require('express');
const router = express.Router();
const materiaControlador = require('../controladores/materiaControlador');

// Ruta para registrar una materia
router.post('/registrar', materiaControlador.registrarMateria);

router.get('/listar', materiaControlador.listarMaterias);

router.delete('/eliminar/:id_materia', materiaControlador.eliminarMateria)

router.put('/actualizar/:id_materia', materiaControlador.actualizarMateria)

router.get('/buscar/:id_materia', materiaControlador.buscarMateriaPorId);

module.exports = router;