// ===============================================
// Servicio: comunas.js
// Funciones para obtener comunas desde el backend
// ===============================================

// API_BASE define la URL base del backend.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ---------------------------------------------------------------
// Función: obtenerComunas()
// Hace una petición GET al endpoint /api/comunas del backend.
//
// Paso a paso:
// - Se conecta al servidor usando fetch()
// - Si la respuesta NO es correcta (res.ok === false), lanza un error
// - Si todo está bien, convierte la respuesta a JSON y la retorna
// ---------------------------------------------------------------
export async function obtenerComunas() {

  // Petición HTTP al backend
  const res = await fetch(`${API_BASE}/api/comunas`);

  // Validación: si la respuesta falla, lanzamos un error controlado
  if (!res.ok) throw new Error("Error cargando comunas");

  // Convertimos la respuesta del servidor a JSON
  return res.json();
}
