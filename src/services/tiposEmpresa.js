// Ruta: src/services/tiposEmpresa.js

// Base de la API: primero VITE_API_URL, si no existe usa Render
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// Endpoint base para tipos de empresa
const API_URL = `${API_BASE}/api/v1/tipos-empresa`;

// GET: listar todos los tipos de empresa + filtro por nombre en el front
export async function listarTiposEmpresa(pagina, busqueda = "") {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error listar tipos empresa:", res.status, txt);
    throw new Error("Error al listar tipos de empresa");
  }

  const data = await res.json();

  // Si no hay texto de búsqueda, devolvemos todo tal cual
  if (!busqueda || !busqueda.trim()) {
    return data;
  }

  // Filtro en memoria por nombre
  const needle = busqueda.trim().toLowerCase();
  return data.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );
}

export async function obtenerTipoEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error obtener tipo empresa:", res.status, txt);
    throw new Error("Error al obtener tipo de empresa");
  }

  return await res.json();
}

export async function crearTipoEmpresa(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error crear tipo empresa:", res.status, txt);
    throw new Error("Error al crear tipo de empresa");
  }

  return await res.json();
}

export async function actualizarTipoEmpresa(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error actualizar tipo empresa:", res.status, txt);
    throw new Error("Error al actualizar tipo de empresa");
  }

  return await res.json();
}

export async function eliminarTipoEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error eliminar tipo empresa:", res.status, txt);
    throw new Error("Error al eliminar tipo de empresa");
  }
}