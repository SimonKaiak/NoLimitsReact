// Ruta: src/services/usuarios.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// IDs de rol (ajusta si en tu BD son otros)
export const ROL_ADMIN_ID = 2;
export const ROL_CLIENTE_ID = 1; // 2 = usuario/cliente normal

// ==========================================================
// LISTADO + BÚSQUEDA (nombre o correo)
// Usado en listados tipo AdminUsuarioList "grande" con filtro
// ==========================================================
export async function listarUsuarios(page = 1, search = "") {
  const trimmed = search.trim();

  let endpoint;
  if (!trimmed) {
    // Lista todos los usuarios
    endpoint = `${API_BASE}/api/v1/usuarios`;
  } else if (trimmed.includes("@")) {
    // Buscar por correo
    endpoint = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(
      trimmed
    )}`;
  } else {
    // Buscar por nombre
    endpoint = `${API_BASE}/api/v1/usuarios/nombre/${encodeURIComponent(
      trimmed
    )}`;
  }

  console.log("[listarUsuarios] endpoint:", endpoint);

  const res = await fetch(endpoint);

  // Si el back devuelve 404 o 204 cuando no hay coincidencias,
  // lo tratamos como "sin resultados", no como error.
  if (res.status === 404 || res.status === 204) {
    console.warn("[listarUsuarios] Sin resultados para búsqueda");
    return {
      contenido: [],
      totalPaginas: 1,
    };
  }

  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarUsuarios] Error HTTP:", res.status, txt);
    throw new Error("Error cargando usuarios");
  }

  const data = await res.json();
  console.log("[listarUsuarios] raw data:", data);

  // Puede venir lista [] o un solo objeto {}
  let contenido = [];

  if (Array.isArray(data)) {
    contenido = data;
  } else if (data) {
    contenido = [data];
  }

  return {
    contenido,
    totalPaginas: 1, // por ahora sin paginación real en el back
  };
}

// ==========================================================
// CRUD BÁSICO POR ID
// Usado por AdminUsuarioList y CrearUsuario
// ==========================================================

// GET /api/v1/usuarios/{id}
export async function obtenerUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`);
  const text = await res.text();

  if (!res.ok) {
    console.error("[obtenerUsuario] status:", res.status, text);
    throw new Error("Error obteniendo usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }
}

// POST /api/v1/usuarios
// Uso general: admin, registro, etc.
export async function crearUsuario(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(text || "Error al crear usuario");
    }
    throw new Error(error.message || "Error al crear usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * EDITAR USUARIO
 * AdminUsuarioList / CrearUsuario (modo "editar") lo usan.
 * En tu back el PATCH /api/v1/usuarios/{id} está disponible,
 * así que lo aprovechamos.
 */
export async function editarUsuario(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "PATCH", // usas PATCH en tu versión original
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(text || "Error al editar usuario");
    }
    throw new Error(error.message || "Error al editar usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// DELETE /api/v1/usuarios/{id}
export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[eliminarUsuario] status:", res.status, text);
    throw new Error("Error al eliminar usuario");
  }

  return true;
}

// ==========================================================
// REGISTRO PÚBLICO DESDE /registro
// (sigue usando crearUsuario por debajo)
// ==========================================================
export async function registrarUsuario(desdeFormulario) {
  const telefonoLimpio = (desdeFormulario.telefono || "").replace(/\D/g, "");
  const telefonoNumero = Number(telefonoLimpio.slice(-9)); // últimos 9 dígitos

  const payload = {
    nombre: (desdeFormulario.nombre || "").trim(),
    apellidos: (desdeFormulario.apellidos || "").trim(),
    correo: (desdeFormulario.correo || "").trim(),
    telefono: telefonoNumero,
    password: (desdeFormulario.contrasena || "").trim(),
    // Rol básico por defecto: CLIENTE
    rol: { id: ROL_CLIENTE_ID },
    // Dirección se gestiona por otro lado; UsuarioModel la expone solo de lectura
  };

  console.log("[registrarUsuario] payload:", payload);
  return crearUsuario(payload);
}

// ==========================================================
// PERFIL (cuando exista la API real) + mocks actuales
// ==========================================================

// MOCK TEMPORAL MIENTRAS NO EXISTE LA API REAL
export async function obtenerMiPerfil() {
  return Promise.resolve({
    id: 1,
    nombre: "James",
    apellidos: "Videla",
    correo: "james@example.com",
    telefono: "987654321",
    rol: { nombre: "Usuario" },
    direccion: {
      calle: "Los Pinos 123",
      comuna: { nombre: "Santiago" },
      region: { nombre: "Metropolitana" },
    },
  });
}

export const verificarCorreoRegistrado = async (correo) => {
  const url = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(
    correo
  )}`;

  const resp = await fetch(url);

  if (resp.status === 404) {
    // Usuario no encontrado
    throw new Error("NOT_FOUND");
  }

  if (!resp.ok) {
    // Otro error del servidor
    throw new Error("SERVER_ERROR");
  }

  // Si todo OK, devolvemos el usuario
  return await resp.json();
};

export async function actualizarMiPerfil(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar perfil");
  return res.json();
}

export async function cambiarPassword(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error cambiando contraseña");
  return res.json();
}

export async function obtenerMisCompras(usuarioId) {
  const res = await fetch(
    `${API_BASE}/api/v1/usuarios/${usuarioId}/compras`
  );

  if (!res.ok) {
    throw new Error("Error obteniendo compras");
  }

  return res.json();
}