// ======================================================================
// Servicio: productos.js
// Encargado de manejar todas las operaciones de productos.
// Incluye:
//
// - LISTAR productos
// - CREAR producto
// - OBTENER producto por ID
// - EDITAR producto completo (PUT)
// - ELIMINAR producto
//
// Este servicio llama a un backend REST y trabaja siempre con JSON.
// ======================================================================


// ----------------------------------------------------------------------
// API_BASE 
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";


// ======================================================================
// LISTAR TODOS LOS PRODUCTOS
// GET /v1/productos
//
// La respuesta del backend a veces es:
//
// - un array directamente       → [ {...}, {...} ]
// - un objeto con "contenido"   → { contenido: [ ... ] }
// - un objeto con "content"     → { content: [ ... ] }
//
// ======================================================================
export async function listarProductos() {

  // Llamamos al endpoint
  const res = await fetch(`${API_BASE}/v1/productos`);

  // Leemos el cuerpo como texto porque a veces el back responde raro.
  const text = await res.text();

  // Si la respuesta NO es OK, lanzamos un error con más detalle.
  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  // Intentamos convertir a JSON.
  // Si falla, devolvemos una lista vacía.
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }

  // Normalizamos para cubrir distintos formatos de respuesta.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.contenido)) return data.contenido;
  if (Array.isArray(data.content)) return data.content;

  return [];
}


// ======================================================================
// CREAR PRODUCTO
// POST /v1/productos
//
// "data" es un objeto con los datos del producto.
// Ejemplo:
// {
//   nombre: "Spider-Man Remastered",
//   precio: 59990,
//   tipoProducto: { id: 1 },
//   estado: { id: 1 }
// }
// ======================================================================
export async function crearProducto(data) {

  const res = await fetch(`${API_BASE}/v1/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // Convertimos el objeto a JSON
  });

  const text = await res.text();

  // Si el backend responde con error, lanzamos excepción
  if (!res.ok) {
    throw new Error(text || "Error al crear producto");
  }

  // Intentamos devolver el JSON
  try {
    return JSON.parse(text);
  } catch {
    return null; // Si no es JSON válido
  }
}


// ======================================================================
// OBTENER PRODUCTO POR ID
// GET /v1/productos/{id}
//
// Retorna un producto específico.
// ======================================================================
export async function obtenerProducto(id) {

  const res = await fetch(`${API_BASE}/v1/productos/${id}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  return JSON.parse(text);
}


// ======================================================================
// EDITAR PRODUCTO (PUT)
// PUT /v1/productos/{id}
//
// Reemplaza COMPLETAMENTE el producto en el backend.
// ======================================================================
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


// ======================================================================
// ELIMINAR PRODUCTO
// DELETE /v1/productos/{id}
//
// Si el backend responde bien, no es necesario devolver nada.
// ======================================================================
export async function eliminarProducto(id) {

  const res = await fetch(`${API_BASE}/v1/productos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar producto");
  }
}
