// Ruta: src/services/productos.js

// ======================================================================
// Servicio: productos.js
// Encargado de manejar todas las operaciones de productos y
// algunos catálogos relacionados (tipos, clasificaciones, estados).
// ======================================================================

// Base del backend (sin /api al final)
const API_ROOT =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// Prefijo de la API v1
const API_V1 = `${API_ROOT}/api/v1`;

// Endpoints principales
const PRODUCTOS_URL = `${API_V1}/productos`;
const TIPOS_URL = `${API_V1}/tipo-productos`;
const CLASIF_URL = `${API_V1}/clasificaciones`;
const ESTADOS_URL = `${API_V1}/estados`;

// ======================================================================
// LISTAR TODOS LOS PRODUCTOS
// GET /api/v1/productos
// ======================================================================
export async function listarProductos() {
  const res = await fetch(PRODUCTOS_URL);
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

  // Por si en algún momento cambias a paginado con "content"/"contenido"
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.contenido)) return data.contenido;
  if (Array.isArray(data.content)) return data.content;

  return [];
}

// ======================================================================
// CREAR PRODUCTO
// POST /api/v1/productos
// ======================================================================
export async function crearProducto(data) {
  const res = await fetch(PRODUCTOS_URL, {
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

// ======================================================================
// OBTENER PRODUCTO POR ID
// GET /api/v1/productos/{id}
// ======================================================================
export async function obtenerProducto(id) {
  const res = await fetch(`${PRODUCTOS_URL}/${id}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  return JSON.parse(text);
}

// ======================================================================
// EDITAR PRODUCTO (PUT COMPLETO)
// PUT /api/v1/productos/{id}
// ======================================================================
export async function editarProducto(id, data) {
  const res = await fetch(`${PRODUCTOS_URL}/${id}`, {
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
// DELETE /api/v1/productos/{id}
// ======================================================================
export async function eliminarProducto(id) {
  const res = await fetch(`${PRODUCTOS_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Error al eliminar producto");
  }
}

// ======================================================================
// CATÁLOGOS PARA SELECTS DEL FORMULARIO
// ======================================================================

// TIPOS DE PRODUCTO
// GET /api/v1/tipo-productos
export async function obtenerTiposProducto() {
  const res = await fetch(TIPOS_URL);
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

  return Array.isArray(data) ? data : [];
}

// CLASIFICACIONES
// GET /api/v1/clasificaciones
export async function obtenerClasificaciones() {
  const res = await fetch(CLASIF_URL);
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

  return Array.isArray(data) ? data : [];
}

// ESTADOS
// GET /api/v1/estados
export async function obtenerEstadosProducto() {
  const res = await fetch(ESTADOS_URL);
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

  return Array.isArray(data) ? data : [];
}

// ======================================================================
// (Opcional) FUNCIONES PARA SAGAS (para el carrusel)
// GET /api/v1/productos/sagas
// GET /api/v1/productos/sagas/{saga}
// ======================================================================
export async function obtenerSagas() {
  const resp = await fetch(`${PRODUCTOS_URL}/sagas`);

  // Si la respuesta no es OK → error
  if (!resp.ok) {
    console.error("Error HTTP:", resp.status);
    return [];
  }

  // Leemos texto primero
  const text = await resp.text();

  // Si viene vacío, devolvemos []
  if (!text || text.trim().length === 0) {
    console.warn("Endpoint /sagas devolvió vacío");
    return [];
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON inválido al obtener sagas:", err, text);
    return [];
  }
}

// ======================================================================
// OBTENER PRODUCTOS POR SAGA
// GET /api/v1/productos/sagas/{saga}
// ======================================================================
export async function obtenerProductosPorSaga(nombreSaga) {
  const url = `${PRODUCTOS_URL}/sagas/${encodeURIComponent(nombreSaga)}`;
  const resp = await fetch(url);
  const text = await resp.text();

  if (!resp.ok) {
    console.error("Error HTTP al obtener productos por saga:", resp.status, text);
    return [];
  }

  if (!text || text.trim().length === 0) {
    console.warn("Endpoint /productos/sagas/{saga} devolvió vacío para:", nombreSaga);
    return [];
  }

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("JSON inválido al obtener productos por saga:", err, text);
    return [];
  }
}

// ======================================================================
// LISTAR PRODUCTOS PAGINADOS
// GET /api/v1/productos/paginacion?page=X&size=Y
// ======================================================================
export async function listarProductosPaginado(page = 1, size = 5) {
  const res = await fetch(`${PRODUCTOS_URL}/paginacion?page=${page}&size=${size}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " → " + text);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Fallback por si algo raro pasa
    return {
      contenido: [],
      pagina: 1,
      totalPaginas: 1,
      totalElementos: 0,
    };
  }

  // Acá asumimos que el back responde con tu PagedResponse:
  // {
  //   contenido: [...],
  //   pagina: number,
  //   totalPaginas: number,
  //   totalElementos: number
  // }
  return data;
}