const API_URL = "";

export async function listarVentas(page = 1, search = "", estado = "") {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);
    if (estado) params.append("estado", estado);

    const res = await fetch(`${API_URL}/ventas?${params.toString()}`);

    if (!res.ok) throw new Error("Error cargando ventas");
    return res.json();
}

export async function obtenerVenta(id) {
    const res = await fetch(`${API_URL}/ventas/${id}`);

    if (!res.ok) throw new Error("Error obteniendo la venta");
    return res.json();
}
