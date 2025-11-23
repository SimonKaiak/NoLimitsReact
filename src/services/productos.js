// Ruta: src/services/productos.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";

// LISTAR TODOS
export async function listarProductos() {
  const res = await fetch(`${API_BASE}/v1/productos`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.contenido)) return data.contenido;
  if (Array.isArray(data.content)) return data.content;
  return [];
}

// CREAR
export async function crearProducto(data) {
  const res = await fetch(`${API_BASE}/v1/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || "Error al crear producto");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// OBTENER POR ID
export async function obtenerProducto(id) {
  const res = await fetch(`${API_BASE}/v1/productos/${id}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  return JSON.parse(text);
}

// EDITAR (PUT)
export async function editarProducto(id, data) {
  const res = await fetch(`${API_BASE}/v1/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || "Error al editar producto");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ELIMINAR
export async function eliminarProducto(id) {
  const res = await fetch(`${API_BASE}/v1/productos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar producto");
  }
}