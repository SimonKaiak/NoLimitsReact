const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";
const API_URL = `${API_BASE}/estados`;

// LISTAR + BUSCAR POR NOMBRE
export async function listarEstados(page = 1, search = "") {
  let url = API_URL;

  // Si hay búsqueda, usamos el endpoint correcto del backend
  if (search && search.trim()) {
    url = `${API_URL}/nombre/${encodeURIComponent(search)}`;
  }

  const res = await fetch(url);

  if (!res.ok) throw new Error("Error cargando estados");
  return res.json();
}

// CREAR
export async function crearEstado(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error al crear estado");
  return res.json();
}

// PUT
export async function editarEstado(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error al editar estado");
  return res.json();
}

// PATCH 
export async function patchEstado(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial)
  });

  if (!res.ok) throw new Error("Error en patch estado");
  return res.json();
}

// ELIMINAR
export async function eliminarEstado(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Error al eliminar estado");
  return true;
}

// OBTENER POR ID
export async function obtenerEstado(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener estado");
  return res.json();
}