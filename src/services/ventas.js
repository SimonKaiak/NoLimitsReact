const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";

// LISTAR TODAS LAS VENTAS
export async function listarVentas() {
  const res = await fetch(`${API_BASE}/v1/ventas`);
  if (!res.ok) throw new Error("Error al listar ventas");
  return res.json();
}

// OBTENER VENTA POR ID (con detalles)
export async function obtenerVenta(id) {
  const res = await fetch(`${API_BASE}/v1/ventas/${id}`);
  if (!res.ok) throw new Error("Error al obtener venta");
  return res.json();
}

// CREAR VENTA
export async function crearVenta(payload) {
  const res = await fetch(`${API_BASE}/v1/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear venta");
  return res.json();
}

// AGREGAR DETALLE A VENTA
export async function crearDetalleVenta(payload) {
  const res = await fetch(`${API_BASE}/v1/detalles-venta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear detalle");
  return res.json();
}