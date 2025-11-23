const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api";

export async function crearDireccion(payload) {
  const res = await fetch(`${API_BASE}/direcciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[crearDireccion] Error HTTP:", res.status, txt);
    throw new Error("Error al crear dirección");
  }

  return res.json();
}