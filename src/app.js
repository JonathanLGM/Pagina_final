require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Importar rutas (verifica las rutas relativas)
const estudianteRutas = require('./rutas/rutasEstudiante');
const profesorRutas = require('./rutas/rutasProfesor');
const materiaRutas = require('./rutas/rutasMateria');
const inscripcionRutas = require('./rutas/rutasInscripcion');
const asignacionRutas = require('./rutas/rutasAsignacion');

// Middlewares (¡colocar CORS primero!)
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/estudiantes', estudianteRutas);
app.use('/api/profesores', profesorRutas);
app.use('/api/materias', materiaRutas);
app.use('/api/inscripciones', inscripcionRutas);
app.use('/api/asignaciones', asignacionRutas);


// Ruta de prueba (opcional)
app.get('/api/test', (req, res) => {
  res.json({ message: "¡Backend funciona!" });
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


