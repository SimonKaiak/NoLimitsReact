// ============================================================
// Servicio: desarrolladores.js
// Funciones CRUD para la entidad "Desarrollador"
// Usadas en el módulo de Catálogos del Administrador
// ============================================================

// API_BASE define la URL base del backend.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";


// ===================================================================
// LISTAR desarrolladores (con filtro por nombre)
// -------------------------------------------------------------------
// - page: actualmente ignorado porque el backend NO maneja paginación.
// - search: texto opcional para filtrar por nombre.
//
// El backend retorna una lista simple. Nosotros la "normalizamos"
// al formato { contenido: [...], totalPaginas: 1 }
// para que combine con el comportamiento del resto de los catálogos.
// ===================================================================
export async function listarDesarrolladores(page = 1, search = "") {

  // Construimos el endpoint: con o sin filtro por nombre
  const endpoint =
    search.trim().length > 0
      ? `${API_BASE}/desarrolladores?nombre=${encodeURIComponent(search)}`
      : `${API_BASE}/desarrolladores`;

  // Hacemos la petición al backend
  const res = await fetch(endpoint);

  // Validamos errores HTTP
  if (!res.ok) {
    console.error("[listarDesarrolladores] Error HTTP", res.status);
    throw new Error("Error cargando desarrolladores");
  }

  // Convertimos la respuesta a JSON
  const data = await res.json();
  console.log("[listarDesarrolladores] raw data:", data);

  // Normalización del formato (lo que el front espera)
  return {
    contenido: Array.isArray(data) ? data : [],
    totalPaginas: 1
  };
}


// ===================================================================
// CREAR desarrollador (POST)
// payload: { nombre: "...", tipoDesarrollador: { id: X }, activo: true }
// ===================================================================
export async function crearDesarrollador(payload) {

  const res = await fetch(`${API_BASE}/desarrolladores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Manejo de errores del backend
  if (!res.ok) {
    let error;
    try {
      error = await res.json(); // backend suele enviar {message: ""}
    } catch {
      throw new Error("Error al crear desarrollador");
    }
    throw new Error(error.message || "Error al crear desarrollador");
  }

  return res.json(); // retorna el desarrollador creado
}


// ===================================================================
// EDITAR desarrollador (PUT)
// ===================================================================
export async function editarDesarrollador(id, payload) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Manejo de errores
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al editar desarrollador");
    }
    throw new Error(error.message || "Error al editar desarrollador");
  }

  return res.json(); // retorna el desarrollador actualizado
}


// ===================================================================
// PATCH desarrollador (actualización parcial)
// ===================================================================
export async function patchDesarrollador(id, payload) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al actualizar desarrollador");

  return res.json();
}


// ===================================================================
// ELIMINAR desarrollador (DELETE)
// ===================================================================
export async function eliminarDesarrollador(id) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar desarrollador");

  return true; // confirmación
}


// ===================================================================
// OBTENER desarrollador por ID (GET /:id)
// ===================================================================
export async function obtenerDesarrollador(id) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`);

  if (!res.ok) throw new Error("Error al obtener desarrollador");

  return res.json(); // retornamos los datos completos del desarrollador
}
