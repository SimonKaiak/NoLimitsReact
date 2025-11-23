// Ruta: src/services/metodosEnvio.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// LISTAR + filtro por nombre en el FRONT
export async function listarMetodosEnvio(page = 1, search = "") {
  const endpoint = `${API_BASE}/api/v1/metodos-envio`;
  console.log("[listarMetodosEnvio] endpoint:", endpoint);

  const res = await fetch(endpoint);

  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarMetodosEnvio] Error HTTP:", res.status, txt);
    throw new Error("Error cargando métodos de envío");
  }

  const data = await res.json();
  console.log("[listarMetodosEnvio] raw data:", data);

  let lista = Array.isArray(data) ? data : [];

  const filtro = search.trim().toLowerCase();
  if (filtro) {
    lista = lista.filter((m) =>
      (m.nombre || "").toLowerCase().includes(filtro)
    );
  }

  return {
    contenido: lista,
    totalPaginas: 1,
  };
}

// CREAR → POST /api/v1/metodos-envio
export async function crearMetodoEnvio(payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-envio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al crear método de envío");
  }

  return res.json();
}

// EDITAR (PUT) → /api/v1/metodos-envio/{id}
export async function editarMetodoEnvio(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al editar método de envío");
  }

  return res.json();
}

// PATCH → /api/v1/metodos-envio/{id}
export async function patchMetodoEnvio(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al actualizar método de envío");
  return res.json();
}

// ELIMINAR → DELETE /api/v1/metodos-envio/{id}
export async function eliminarMetodoEnvio(id) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar método de envío");
  return true;
}

// OBTENER POR ID → GET /api/v1/metodos-envio/{id}
export async function obtenerMetodoEnvio(id) {
  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`);

  if (!res.ok) throw new Error("Error al obtener método de envío");
  return res.json();
}