// Ruta: src/services/desarrolladores.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";

// LISTAR paginado + búsqueda
export async function listarDesarrolladores(page = 1, search = "") {
  // Por ahora el backend NO maneja paginación en este endpoint,
  // así que ignoramos "page" y solo filtramos por nombre.

  const endpoint =
    search.trim().length > 0
      ? `${API_BASE}/desarrolladores?nombre=${encodeURIComponent(search)}`
      : `${API_BASE}/desarrolladores`;

  const res = await fetch(endpoint);

  if (!res.ok) {
    console.error("[listarDesarrolladores] Error HTTP", res.status);
    throw new Error("Error cargando desarrolladores");
  }

  const data = await res.json();
  console.log("[listarDesarrolladores] raw data:", data);

  // El backend devuelve una lista de DesarrolladorModel
  // Normalizamos al formato que espera el componente
  return {
    contenido: Array.isArray(data) ? data : [],
    totalPaginas: 1
  };
}

// CREAR
export async function crearDesarrollador(payload) {
  const res = await fetch(`${API_BASE}/desarrolladores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al crear desarrollador");
    }
    throw new Error(error.message || "Error al crear desarrollador");
  }

  return res.json();
}

// EDITAR (PUT)
export async function editarDesarrollador(id, payload) {
  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al editar desarrollador");
    }
    throw new Error(error.message || "Error al editar desarrollador");
  }

  return res.json();
}

// PATCH
export async function patchDesarrollador(id, payload) {
  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al actualizar desarrollador");
  return res.json();
}

// ELIMINAR
export async function eliminarDesarrollador(id) {
  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar desarrollador");
  return true;
}

// OBTENER POR ID
export async function obtenerDesarrollador(id) {
  const res = await fetch(`${API_BASE}/desarrolladores/${id}`);
  if (!res.ok) throw new Error("Error al obtener desarrollador");
  return res.json();
}