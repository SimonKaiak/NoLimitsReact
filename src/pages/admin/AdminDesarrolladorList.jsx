import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearDesarrollador from "../../components/organisms/CrearDesarrollador";
import { listarDesarrolladores, eliminarDesarrollador, obtenerDesarrollador } from "../../services/desarrolladores";

export default function AdminDesarrolladorList() {

    const [lista, setLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");       // BÚSQUEDA REAL
    const [busquedaTemp, setBusquedaTemp] = useState(""); // TEXTO ESCRITO
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);

    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        cargarDesarrolladores();
    }, [pagina, busqueda]);

    async function cargarDesarrolladores() {
        setLoading(true);

        try {
            const data = await listarDesarrolladores(pagina, busqueda);
            setLista(data.contenido || []);
            setTotalPaginas(data.totalPaginas || 1);
        } catch (err) {
            alert("❌ Error al cargar desarrolladores");
        }

        setLoading(false);
    }

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar desarrollador?")) return;

        try {
            await eliminarDesarrollador(id);
            await cargarDesarrolladores();
            alert("Desarrollador eliminado!");
        } catch (err) {
            alert("❌ Error al eliminar");
        }
    };

    const abrirModalEditar = async (item) => {
        try {
            const dev = await obtenerDesarrollador(item.id);

            setModalData({
                modo: "editar",
                desarrollador: dev
            });
        } catch (err) {
            alert("❌ Error al obtener desarrollador");
        }
    };

    return (
        <div className="admin-wrapper">

            <h1 className="admin-title">Gestionar Desarrolladores</h1>

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
                    text="Crear Desarrollador"
                    onClick={() =>
                        setModalData({
                            modo: "crear",
                            desarrollador: null
                        })
                    }
                />
            </div>

            {/* Modal */}
            {modalData && (
                <CrearDesarrollador
                    modo={modalData.modo}
                    desarrollador={modalData.desarrollador}
                    onCerrar={() => {
                        setModalData(null);
                        cargarDesarrolladores();
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
                        <tr>
                            <td colSpan="4" className="admin-msg">Cargando...</td>
                        </tr>
                    ) : lista.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="admin-msg">No hay resultados</td>
                        </tr>
                    ) : (
                        lista.map((d) => (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.nombre}</td>
                                <td>{d.activo ? "Si" : "No"}</td>

                                <td className="admin-actions">
                                    <ButtonAction
                                        text="Editar"
                                        onClick={() => abrirModalEditar(d)}
                                    />
                                    <ButtonAction
                                        text="Eliminar"
                                        onClick={() => handleEliminar(d.id)}
                                    />
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