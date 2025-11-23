const API_URL = "";

// LISTAR paginado + búsqueda
export async function listarRoles(page = 1, search = "") {
    const res = await fetch(
        `${API_URL}/roles?page=${page}&search=${encodeURIComponent(search)}`
    );

    if (!res.ok) throw new Error("Error cargando roles");
    return res.json();
}

// CREAR
export async function crearRole(payload) {
    const res = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear rol");
    }

    return res.json();
}

// EDITAR (PUT)
export async function editarRole(id, payload) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al editar rol");
    }

    return res.json();
}

// PATCH 
export async function patchRole(id, payloadParcial) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadParcial)
    });

    if (!res.ok) throw new Error("Error en PATCH rol");
    return res.json();
}

// ELIMINAR
export async function eliminarRole(id) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Error al eliminar rol");
    return true;
}

// OBTENER POR ID
export async function obtenerRole(id) {
    const res = await fetch(`${API_URL}/roles/${id}`);
    if (!res.ok) throw new Error("Error al obtener rol");
    return res.json();
}

/**
 * Obtiene todos los roles sin paginación. 
 * 
 * Paginación es una técnica para mostrar los datos de apoco en vez de cargar
 * todo de una sola vez, permitiendo así que las listas más grandes carguen más rapido
 * y no saturen la pantalla.
 * 
 * Esta función es para formularios (como Crear Usuario),
 * donde solo necesitamos una lista simple de roles para
 * mostrar en un <select>.
 * 
 * listarRoles() no sirve aquí porque trae datos con
 * paginación y estructura más compleja.
 */

// LISTAR SOLO LOS ROLES (sin paginación, para el select)
export async function fetchRoles() {
    const res = await fetch(`${API_URL}/roles`);
    
    if (!res.ok) {
        throw new Error("Error al obtener lista de roles");
    }

    return res.json(); 
}
