// 1. URL de tu API backend (ajusta el puerto si es necesario)
const API_URL = "http://localhost:3000/api/estudiantes";

// 2. Función para cargar y mostrar estudiantes
async function cargarEstudiantes() {
    try {
        const response = await fetch(API_URL);
        const estudiantes = await response.json();
        mostrarEstudiantes(estudiantes);
    } catch (error) {
        console.error("Error al cargar estudiantes:", error);
    }
}

// 3. Función para renderizar estudiantes en la tabla
function mostrarEstudiantes(estudiantes) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
        <h2>Lista de Estudiantes</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                </tr>
            </thead>
            <tbody>
                ${estudiantes.map(est => `
                    <tr>
                        <td>${est.id}</td>
                        <td>${est.nombre}</td>
                        <td>${est.edad}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

// 4. Evento del formulario para agregar estudiantes (TU CÓDIGO)
document.getElementById("formEstudiante").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nuevoEstudiante = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoEstudiante)
        });
        const data = await response.json();
        alert("Estudiante agregado!");
        cargarEstudiantes(); // Recargar la lista después de agregar
    } catch (error) {
        console.error("Error:", error);
    }
});

// 5. Inicializar la carga de estudiantes al abrir la página
document.addEventListener("DOMContentLoaded", cargarEstudiantes);