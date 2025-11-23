// Ruta: src/services/generos.js
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";
const API_URL = `${API_BASE}/generos`;

// LISTAR + BUSCAR POR NOMBRE
export async function listarGeneros(page = 1, search = "") {
  let url = API_URL;

  // Si viene texto de búsqueda, usamos /generos/nombre/{nombre}
  if (search && search.trim()) {
    url = `${API_URL}/nombre/${encodeURIComponent(search)}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error cargando géneros");
  return res.json();
}

// CREAR
export async function crearGenero(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al crear género");
  return res.json();
}

// PUT
export async function editarGenero(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al editar género");
  return res.json();
}

// PATCH
export async function patchGenero(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) throw new Error("Error al aplicar patch");
  return res.json();
}

// ELIMINAR
export async function eliminarGenero(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar");
  return true;
}

// OBTENER POR ID
export async function obtenerGenero(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener género");
  return res.json();
}