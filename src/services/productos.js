// Ruta: src/services/productos.js

// URL base REAL de tu backend en Render (ya incluye /api/v1)
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";

// Helper para des-envolver respuestas HATEOAS o arrays planos
function unwrapEmbedded(json) {
  if (Array.isArray(json)) return json;

  if (json && json._embedded) {
    const keys = Object.keys(json._embedded);
    if (keys.length > 0) {
      return json._embedded[keys[0]] || [];
    }
  }
  return [];
}

// ======================= PRODUCTOS =======================

// GET paginado + búsqueda (si el back ignora page/search, igual funciona)
export async function listarProductos(page = 1, search = "") {
  const url = `${API_BASE}/productos?page=${page}&search=${encodeURIComponent(
    search
  )}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json(); // esperado: { contenido: [...], totalPaginas: X } o similar
}

// GET obtener producto por id
export async function obtenerProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`);
  if (!res.ok) throw new Error("Error al obtener producto");
  return res.json();
}

// POST crear producto
// payload debe ser: { nombre, precio, tipoProducto: {id}, clasificacion: {id}? , estado: {id} }
export async function crearProducto(payload) {
  const res = await fetch(`${API_BASE}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al crear el producto");
  return res.json();
}

// PUT editar producto
export async function editarProducto(id, payload) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al editar el producto");
  return res.json();
}

// DELETE eliminar producto
export async function eliminarProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar el producto");
  return true;
}

// ======================= CATÁLOGO =======================

export async function actualizarCatalogo(idProducto, dataCatalogo) {
  const res = await fetch(`${API_BASE}/productos/${idProducto}/catalogo`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      generosIds: dataCatalogo.generos,
      plataformasIds: dataCatalogo.plataformas,
      empresasIds: dataCatalogo.empresas,
      desarrolladoresIds: dataCatalogo.desarrolladores,
    }),
  });

  if (!res.ok) throw new Error("Error al actualizar el catálogo");
  return res.json();
}

export async function patchGeneros(idProducto, generosIds) {
  const res = await fetch(`${API_BASE}/productos/${idProducto}/generos`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: generosIds }),
  });
  if (!res.ok) throw new Error("Error al actualizar el género");
  return res.json();
}

export async function patchPlataformas(idProducto, plataformasIds) {
  const res = await fetch(`${API_BASE}/productos/${idProducto}/plataformas`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: plataformasIds }),
  });
  if (!res.ok) throw new Error("Error al actualizar las plataformas");
  return res.json();
}

export async function patchEmpresas(idProducto, empresasIds) {
  const res = await fetch(`${API_BASE}/productos/${idProducto}/empresas`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: empresasIds }),
  });
  if (!res.ok) throw new Error("Error al actualizar empresas");
  return res.json();
}

export async function patchDesarrolladores(idProducto, desarrolladoresIds) {
  const res = await fetch(
    `${API_BASE}/productos/${idProducto}/desarrolladores`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: desarrolladoresIds }),
    }
  );
  if (!res.ok) throw new Error("Error al actualizar los desarrolladores");
  return res.json();
}

// ======================= IMÁGENES =======================

export async function obtenerImagenes(idProducto) {
  const res = await fetch(`${API_BASE}/productos/${idProducto}/imagenes`);
  if (!res.ok) throw new Error("Error al obtener imágenes");
  return res.json();
}

export async function subirImagen(idProducto, file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/productos/${idProducto}/imagenes`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Error al subir la imagen");
  return res.json();
}

export async function eliminarImagen(idProducto, idImagen) {
  const res = await fetch(
    `${API_BASE}/productos/${idProducto}/imagenes/${idImagen}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Error al eliminar la imagen");
  return true;
}

// ======================= SELECTS =======================
// Estas llamadas soportan tanto arrays planos como respuestas HATEOAS.

export async function fetchTiposProducto() {
  const res = await fetch(`${API_BASE}/tipos-producto`);
  if (!res.ok) throw new Error("Error al cargar tipos de productos");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchClasificaciones() {
  const res = await fetch(`${API_BASE}/clasificaciones`);
  if (!res.ok) throw new Error("Error al cargar las clasificaciones");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchEstados() {
  const res = await fetch(`${API_BASE}/estados-producto`);
  if (!res.ok) throw new Error("Error al cargar estados");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchGeneros() {
  const res = await fetch(`${API_BASE}/generos`);
  if (!res.ok) throw new Error("Error al cargar géneros");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchPlataformas() {
  const res = await fetch(`${API_BASE}/plataformas`);
  if (!res.ok) throw new Error("Error al cargar plataformas");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchEmpresas() {
  const res = await fetch(`${API_BASE}/empresas`);
  if (!res.ok) throw new Error("Error al cargar empresas");
  const json = await res.json();
  return unwrapEmbedded(json);
}

export async function fetchDesarrolladores() {
  const res = await fetch(`${API_BASE}/desarrolladores`);
  if (!res.ok) throw new Error("Error al cargar los desarrolladores");
  const json = await res.json();
  return unwrapEmbedded(json);
}