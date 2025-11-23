// Ruta: src/services/plataformas.js
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";
const API_URL = `${API_BASE}/plataformas`;

// LISTAR con búsqueda en el front
export async function listarPlataformas(page = 1, search = "") {
  // Por ahora ignoramos page porque el back no pagina
  const res = await fetch(API_URL);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando plataformas:", res.status, txt);
    throw new Error("Error cargando plataformas");
  }

  const data = await res.json();

  // Si no hay búsqueda, devolvemos tal cual
  if (!search || !search.trim()) {
    return data;
  }

  // Si hay búsqueda, filtramos por nombre en el front
  const needle = search.trim().toLowerCase();
  const lista = Array.isArray(data) ? data : data.contenido || [];

  return lista.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );
}

// CREAR
export async function crearPlataforma(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al crear plataforma:", res.status, error);
    throw new Error("Error al crear plataforma");
  }

  return res.json();
}

// EDITAR (PUT)
export async function editarPlataforma(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al editar plataforma:", res.status, error);
    throw new Error("Error al editar plataforma");
  }

  return res.json();
}

// PATCH
export async function patchPlataforma(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al actualizar parcialmente:", res.status, error);
    throw new Error("Error al actualizar parcialmente");
  }

  return res.json();
}

// ELIMINAR
export async function eliminarPlataforma(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al eliminar plataforma:", res.status, error);
    throw new Error("Error al eliminar plataforma");
  }

  return true;
}

// OBTENER POR ID
export async function obtenerPlataforma(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al obtener plataforma:", res.status, error);
    throw new Error("Error al obtener plataforma");
  }

  return res.json();
}