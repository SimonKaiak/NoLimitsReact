const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

export async function obtenerRegiones() {
  const res = await fetch(`${API_BASE}/api/v2/regiones`);
  if (!res.ok) throw new Error("Error cargando regiones");
  return res.json();
}