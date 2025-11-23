// Ruta: src/services/usuarios.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// IDs de rol (ajusta si en tu BD son otros)
export const ROL_ADMIN_ID = 1;
export const ROL_CLIENTE_ID = 2; // 2 = usuario/cliente normal

// LISTADO + BÚSQUEDA (nombre o correo)
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

  // 👉 Si el back devuelve 404 o 204 cuando no hay coincidencias,
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

// OBTENER POR ID
export async function obtenerUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`);
  if (!res.ok) throw new Error("Error obteniendo usuario");
  return res.json();
}

// CREAR USUARIO (uso general, admin, etc.)
export async function crearUsuario(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al crear usuario");
    }
    throw new Error(error.message || "Error al crear usuario");
  }

  return res.json();
}

/**
 * REGISTRO PÚBLICO DESDE /registro
 * Recibe el formData del componente Registro y arma el payload
 * que espera tu UsuarioModel (telefono Integer, password máx 10, rol CLIENTE).
 */
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

// EDITAR USUARIO (PATCH)
export async function editarUsuario(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al editar usuario");
    }
    throw new Error(error.message || "Error al editar usuario");
  }

  return res.json();
}

// ELIMINAR USUARIO
export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar usuario");
  return true;
}

/* ================= PERFIL (cuando exista la API real) =================

// Ejemplo futuro real:
// export async function obtenerMiPerfil() {
//   const res = await fetch(`${API_BASE}/api/v1/usuarios/me`);
//   if (!res.ok) throw new Error("Error al obtener perfil");
//   return res.json();
// }
*/

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