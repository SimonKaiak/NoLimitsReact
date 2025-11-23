const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

export async function obtenerDireccion(id) {
  const res = await fetch(`${API_BASE}/api/direcciones/${id}`);
  const text = await res.text();

  if (!res.ok) {
    console.error("[obtenerDireccion] status:", res.status, text);
    throw new Error("Error obteniendo dirección");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida al obtener dirección");
  }
}

export async function crearDireccion(payload) {
  const res = await fetch(`${API_BASE}/api/direcciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[crearDireccion] status:", res.status, text);
    throw new Error("Error al crear dirección");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function actualizarDireccion(id, payload) {
  const res = await fetch(`${API_BASE}/api/direcciones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[actualizarDireccion] status:", res.status, text);
    throw new Error("Error al actualizar dirección");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}