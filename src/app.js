// _BACKEND_COLEGIO/src/app.js

require('dotenv').config();
const express = require('express');
const path = require('path'); // <--- Asegúrate que esta línea esté
const app = express();
const cors = require('cors');

// Importar rutas existentes
const estudianteRutas = require('./rutas/rutasEstudiante');
const profesorRutas = require('./rutas/rutasProfesor');
const materiaRutas = require('./rutas/rutasMateria');
const inscripcionRutas = require('./rutas/rutasInscripcion');
const asignacionRutas = require('./rutas/rutasAsignacion');

// --- PRÓXIMAMENTE: Importar rutas y middleware de autenticación ---
// const authRutas = require('./rutas/rutasAuth');
// const { protegerRuta } = require('./middleware/authMiddleware'); // Suponiendo que el middleware se llame así

// Middlewares globales
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Para parsear bodies de request en formato JSON

// Servir archivos estáticos desde la carpeta 'Public'
// __dirname es el directorio actual (src), '../Public' sube un nivel y entra a Public
app.use(express.static(path.join(__dirname, '../Public')));

// --- PRÓXIMAMENTE: Montar rutas de autenticación (login, registro de usuarios) ---
// Estas rutas NO estarán protegidas por el token, ya que son para obtenerlo o crear el usuario.
// app.use('/api/auth', authRutas);

// Montar rutas API existentes
// --- PRÓXIMAMENTE: Aquí aplicaríamos el middleware 'protegerRuta' a las rutas que lo necesiten ---
// Ejemplo: app.use('/api/estudiantes', protegerRuta, estudianteRutas);
// Por ahora, las dejamos como están:
app.use('/api/estudiantes', estudianteRutas);
app.use('/api/profesores', profesorRutas);
app.use('/api/materias', materiaRutas);
app.use('/api/inscripciones', inscripcionRutas);
app.use('/api/asignaciones', asignacionRutas);


// Ruta de prueba (opcional, para verificar que el backend base funciona)
app.get('/api/test', (req, res) => {
  res.json({ message: "¡Backend funciona correctamente!" });
});

// Middleware para manejar rutas API no encontradas (404)
// Se ejecutará si ninguna ruta API anterior coincide
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Error: Ruta API no encontrada.' });
});

// Middleware "catch-all" para servir la página de login (o principal si ya está logueado)
// para cualquier ruta no manejada por express.static o las rutas API.
// Esto es útil para que, si el usuario escribe cualquier cosa en la URL que no sea una API o un archivo,
// no reciba un "Cannot GET /ruta".
app.get('*', (req, res) => {
  // Por ahora, simplemente redirigimos a login.html como fallback.
  // Más adelante, aquí podríamos tener lógica para verificar si existe un token
  // y redirigir a principal.html si está logueado, o a login.html si no.
  res.sendFile(path.join(__dirname, '../Public/login.html'));
});


// Iniciar servidor
const PORT = process.env.PORT || 3000; // Usar el puerto de .env o 3000 por defecto

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Accede a la aplicación en http://localhost:${PORT}`);
});