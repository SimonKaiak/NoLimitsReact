// ======================================================================
// Servicio: regiones.js
// Encargado de obtener la lista de regiones desde el backend.
//
//
// GET /api/v2/regiones
// ======================================================================


// ----------------------------------------------------------------------
// API_BASE 
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ======================================================================
// obtenerRegiones()
// Llama al backend para traer TODAS las regiones.
//
// Funcionamiento:
// 1. Se hace una petición GET al endpoint /api/v2/regiones
// 2. Si el servidor responde con error (status 400, 404, 500, etc.)
//    lanzamos un mensaje explicando que falló la carga.
// 3. Si todo está bien, devolvemos la respuesta como JSON.
//
// Esta función se usa para llenar selects de "Región" en formularios.
// ======================================================================
export async function obtenerRegiones() {

  // Hacemos la solicitud GET al backend
  const res = await fetch(`${API_BASE}/api/v2/regiones`);

  // Si la respuesta NO es correcta, avisamos del error
  if (!res.ok) {
    throw new Error("Error cargando regiones");
  }

  // Convertimos la respuesta a JSON y la devolvemos
  return res.json();
}
