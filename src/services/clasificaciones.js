
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

const API_URL = `${API_BASE}/api/v1/clasificaciones`;

// LISTAR (GET all + filtro por nombre en el front)
export async function listarClasificaciones(page = 1, search = "") {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando clasificaciones:", res.status, txt);
    throw new Error("Error cargando clasificaciones");
  }

  const data = await res.json();

  if (!search || !search.trim()) {
    return data;
  }

  const needle = search.trim().toLowerCase();
  return data.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );
}

// CREAR
export async function crearClasificacion(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al crear clasificación:", res.status, txt);
    throw new Error("Error al crear clasificación");
  }

  return res.json();
}

// PUT
export async function editarClasificacion(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al editar clasificación:", res.status, txt);
    throw new Error("Error al editar clasificación");
  }

  return res.json();
}

// PATCH
export async function patchClasificacion(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al aplicar patch clasificación:", res.status, txt);
    throw new Error("Error al aplicar patch");
  }

  return res.json();
}

// ELIMINAR
export async function eliminarClasificacion(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al eliminar clasificación:", res.status, txt);
    throw new Error("Error al eliminar");
  }

  return true;
}

// OBTENER
export async function obtenerClasificacion(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al obtener clasificación:", res.status, txt);
    throw new Error("Error al obtener clasificación");
  }

  return res.json();
}