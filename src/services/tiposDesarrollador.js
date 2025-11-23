// Base de la API: primero VITE_API_URL, si no existe usa Render
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// Endpoint base para tipos de desarrollador
const API_URL = `${API_BASE}/api/tipos-desarrollador`;

// GET: listar todos los tipos de desarrollador + filtro por nombre en el front
export async function listarTiposDesarrollador(pagina, busqueda = "") {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error listar tipos desarrollador:", res.status, txt);
    throw new Error("Error al listar tipos de desarrollador");
  }

  const data = await res.json();

  // ⬇️ Si no hay texto de búsqueda, devolvemos todo tal cual
  if (!busqueda || !busqueda.trim()) {
    return data;
  }

  // ⬇️ Filtro en memoria por nombre
  const needle = busqueda.trim().toLowerCase();
  return data.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );
}

// GET: obtener uno por ID
export async function obtenerTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error obtener tipo desarrollador:", res.status, txt);
    throw new Error("Error al obtener tipo de desarrollador");
  }

  return await res.json();
}

// POST: crear
export async function crearTipoDesarrollador(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error crear tipo desarrollador:", res.status, txt);
    throw new Error("Error al crear tipo de desarrollador");
  }

  return await res.json();
}

// PUT: actualizar completo
export async function actualizarTipoDesarrollador(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error actualizar tipo desarrollador:", res.status, txt);
    throw new Error("Error al actualizar tipo de desarrollador");
  }

  return await res.json();
}

// DELETE: eliminar
export async function eliminarTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error eliminar tipo desarrollador:", res.status, txt);
    throw new Error("Error al eliminar tipo de desarrollador");
  }
}