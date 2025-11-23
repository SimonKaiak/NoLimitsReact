// Ruta: src/services/tiposProducto.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

const API_URL = `${API_BASE}/api/v1/tipo-productos`;

// LISTAR + BUSCAR
export async function listarTiposProducto(page = 1, search = "") {

  // Si hay búsqueda → usamos endpoint /buscar
  const url = search && search.trim()
    ? `${API_URL}/buscar?nombre=${encodeURIComponent(search.trim())}`
    : API_URL;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando tipos de productos:", res.status, txt);
    throw new Error("Error cargando tipos de productos");
  }

  return await res.json();
}

// CREAR
export async function crearTipoProducto(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al crear tipo de producto:", res.status, txt);
    throw new Error("Error al crear tipo de producto");
  }

  return res.json();
}

// PUT
export async function editarTipoProducto(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al editar tipo de producto:", res.status, txt);
    throw new Error("Error al editar tipo de producto");
  }

  return res.json();
}

// PATCH
export async function patchTipoProducto(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error en patch tipo producto:", res.status, txt);
    throw new Error("Error en patch tipo producto");
  }

  return res.json();
}

// ELIMINAR
export async function eliminarTipoProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al eliminar tipo de producto:", res.status, txt);
    throw new Error("Error al eliminar");
  }

  return true;
}

// OBTENER POR ID
export async function obtenerTipoProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al obtener tipo de producto:", res.status, txt);
    throw new Error("Error al obtener tipo de producto");
  }

  return res.json();
}