import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearMetodoPago from "../../components/organisms/CrearMetodoPago";
import { listarMetodosPago, eliminarMetodoPago, obtenerMetodoPago } from "../../services/metodosPago";

export default function AdminMetodoPagoList() {

    const [metodos, setMetodos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [busquedaTemp, setBusquedaTemp] = useState("");

    useEffect(() => {
        cargarMetodos();
    }, [pagina, busqueda]);

    async function cargarMetodos() {
        setLoading(true);

        try {
            const data = await listarMetodosPago(pagina, busqueda);

            setMetodos(data.contenido || []);
            setTotalPaginas(data.totalPaginas || 1);

        } catch (err) {
            alert("❌ Error al cargar métodos de pago");
        }

        setLoading(false);
    }

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar método de pago?")) return;

        try {
            await eliminarMetodoPago(id);
            setMetodos((prev) => prev.filter((m) => m.id !== id));
            alert("Método eliminado!");

        } catch (err) {
            alert("❌ Error al eliminar");
        }
    };

    const abrirModalEditar = async (fila) => {
        try {
            const metodo = await obtenerMetodoPago(fila.id);

            setModalData({
                modo: "editar",
                metodo
            });

        } catch (err) {
            alert("❌ Error al obtener método de pago");
        }
    };

    return (
        <div className="admin-wrapper">

            <h1 className="admin-title">Gestionar Métodos de Pago</h1>

            {/* Buscador */}
            <div className="admin-form">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busquedaTemp}
                    onChange={(e) => setBusquedaTemp(e.target.value)}
                    className="admin-input"
                    />

                    <ButtonAction 
                    text="Buscar"
                    onClick={() => {
                        setBusqueda(busquedaTemp);
                        setPagina(1);
                    }}
                    />
            </div>

            {/* Crear */}
            <div className="admin-form">
                <ButtonAction
                    text="Crear Método de Pago"
                    onClick={() => setModalData({ modo: "crear", metodo: null })}
                />
            </div>

            {/* Modal */}
            {modalData && (
                <CrearMetodoPago
                    modo={modalData.modo}
                    metodo={modalData.metodo}
                    onCerrar={() => {
                        setModalData(null);
                        cargarMetodos();
                    }}
                />
            )}

            {/* Tabla */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr><td colSpan="4" className="admin-msg">Cargando...</td></tr>
                    ) : metodos.length === 0 ? (
                        <tr><td colSpan="4" className="admin-msg">No hay resultados</td></tr>
                    ) : (
                        metodos.map((m) => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.nombre}</td>
                                <td>{m.activo ? "Sí" : "No"}</td>

                                <td className="admin-actions">
                                    <ButtonAction text="Editar" onClick={() => abrirModalEditar(m)} />
                                    <ButtonAction text="Eliminar" onClick={() => handleEliminar(m.id)} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="admin-pagination">
                <ButtonAction
                    text="Anterior"
                    disabled={pagina <= 1}
                    onClick={() => setPagina((p) => p - 1)}
                />

                <span className="admin-page-info">
                    Página {pagina} / {totalPaginas}
                </span>

                <ButtonAction
                    text="Siguiente"
                    disabled={pagina >= totalPaginas}
                    onClick={() => setPagina((p) => p + 1)}
                />
            </div>
        </div>
    );
}
