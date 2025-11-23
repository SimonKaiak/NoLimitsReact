// Ruta: src/services/empresas.js
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";
const API_URL = `${API_BASE}/empresas`;

// LISTAR + BÚSQUEDA EN FRONT
export async function listarEmpresas(page = 1, search = "") {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando empresas:", res.status, txt);
    throw new Error("Error cargando empresas");
  }

  const data = await res.json();

  // si no hay búsqueda, devolvemos tal cual
  if (!search || !search.trim()) {
    return data;
  }

  const needle = search.trim().toLowerCase();
  const lista = Array.isArray(data) ? data : data.contenido || [];

  return lista.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );
}

// CREAR
export async function crearEmpresa(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al crear empresa:", res.status, error);
    throw new Error("Error al crear empresa");
  }

  return res.json();
}

// EDITAR COMPLETO (PUT)
export async function editarEmpresa(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al editar empresa:", res.status, error);
    throw new Error("Error al editar empresa");
  }

  return res.json();
}

// PATCH 
export async function patchEmpresa(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error en PATCH empresa:", res.status, error);
    throw new Error("Error en PATCH empresa");
  }

  return res.json();
}

// ELIMINAR
export async function eliminarEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al eliminar empresa:", res.status, error);
    throw new Error("Error al eliminar empresa");
  }

  return true;
}

// OBTENER POR ID
export async function obtenerEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al obtener empresa:", res.status, error);
    throw new Error("Error al obtener empresa");
  }
  return res.json();
}