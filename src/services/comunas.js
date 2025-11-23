const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

export async function obtenerComunas() {
  const res = await fetch(`${API_BASE}/api/comunas`);
  if (!res.ok) throw new Error("Error cargando comunas");
  return res.json();
}