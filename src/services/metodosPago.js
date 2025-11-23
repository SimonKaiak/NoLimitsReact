// Ruta: src/services/metodosPago.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// LISTAR + búsqueda por nombre
export async function listarMetodosPago(page = 1, search = "") {
  const trimmed = search.trim();

  const endpoint =
    trimmed.length > 0
      ? `${API_BASE}/api/v1/metodos-pago/buscar/${encodeURIComponent(trimmed)}`
      : `${API_BASE}/api/v1/metodos-pago`;

  console.log("[listarMetodosPago] endpoint:", endpoint);

  const res = await fetch(endpoint);

  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarMetodosPago] Error HTTP:", res.status, txt);
    throw new Error("Error cargando métodos de pago");
  }

  const data = await res.json();
  console.log("[listarMetodosPago] raw data:", data);

  // /metodos-pago          → lista []
  // /metodos-pago/buscar   → un objeto {}
  let contenido = [];

  if (Array.isArray(data)) {
    contenido = data;
  } else if (data) {
    contenido = [data];
  }

  return {
    contenido,
    totalPaginas: 1,
  };
}

// CREAR → POST /api/v1/metodos-pago
export async function crearMetodoPago(payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-pago`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      throw new Error("Error al crear método de pago");
    }
    throw new Error(err.message || "Error al crear método de pago");
  }

  return res.json();
}

// EDITAR (PUT) → /api/v1/metodos-pago/{id}
export async function editarMetodoPago(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      throw new Error("Error al editar método de pago");
    }
    throw new Error(err.message || "Error al editar método de pago");
  }

  return res.json();
}

// PATCH → /api/v1/metodos-pago/{id}
export async function patchMetodoPago(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error en PATCH de método de pago");
  return res.json();
}

// ELIMINAR → DELETE /api/v1/metodos-pago/{id}
export async function eliminarMetodoPago(id) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar método de pago");
  return true;
}

// OBTENER POR ID → GET /api/v1/metodos-pago/{id}
export async function obtenerMetodoPago(id) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`);

  if (!res.ok) throw new Error("Error al obtener método de pago");
  return res.json();
}