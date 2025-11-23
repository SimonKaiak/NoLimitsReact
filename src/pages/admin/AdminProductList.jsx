import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearProducto from "../../components/organisms/CrearProducto.jsx";
import { useNavigate } from "react-router-dom"; 
import "../../styles/adminBase.css"

// Importar servicios reales
import { listarProductos, eliminarProducto, obtenerProducto } from "../../services/productos.js";

export default function AdminProductosList() {

    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Modal Crear/Editar
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, [pagina, busqueda]);

    async function cargarProductos() {
        setLoading(true);

        try {
            const data = await listarProductos(pagina, busqueda);

            setProductos(data.contenido || []);
            setTotalPaginas(data.totalPaginas || 1);

        } catch (err) {
            console.error("Error cargando productos:", err);
            alert("❌ Error al cargar productos");
        }

        setLoading(false);
    }

    // -------------------------------------
    // ELIMINAR PRODUCTO
    // -------------------------------------
    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar este producto?")) return;

        try {
            await eliminarProducto(id);

            // Remover del front sin recargar todo
            setProductos((prev) => prev.filter((p) => p.id !== id));

            alert("Producto eliminado correctamente");

        } catch (err) {
            console.error(err);
            alert("❌ Error al eliminar producto");
        }
    };

    // -------------------------------------
    // EDITAR PRODUCTO (traer datos reales)
    // -------------------------------------
    const abrirModalEditar = async (productoTabla) => {
        try {
            const productoCompleto = await obtenerProducto(productoTabla.id);

            setModalData({
                modo: "editar",
                producto: productoCompleto
            });

        } catch (err) {
            console.error(err);
            alert("❌ Error al obtener datos del producto");
        }
    };

    return (
        <div className="admin-wrapper">

            <h1 className="admin-title">Gestionar Productos</h1>

            {/* Buscador */}
            <div className="admin-form">

                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPagina(1);
                    }}
                    className="admin-input"
                />

                <ButtonAction text="Buscar" onClick={() => setPagina(1)} />
            </div>

            {/* Crear Producto */}
            <div className="admin-form">
                <ButtonAction
                    text="Crear Producto"
                    onClick={() =>
                        setModalData({
                            modo: "crear",
                            producto: null
                        })
                    }
                />
            </div>

            {/* Modal Crear / Editar */}
            {modalData && (
                <CrearProducto
                    modo={modalData.modo}
                    producto={modalData.producto}
                    onCerrar={() => {
                        setModalData(null);
                        cargarProductos();
                    }}
                />
            )}

            {/* Tabla */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="admin-msg">Cargando...</td>
                        </tr>
                    ) : productos.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="admin-msg">No hay resultados</td>
                        </tr>
                    ) : (
                        productos.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>${p.precio.toLocaleString()}</td>

                                <td className="admin-actions">
                                    {/* EDITAR */}
                                    <ButtonAction
                                        text="Editar"
                                        onClick={() => abrirModalEditar(p)}
                                    />

                                    {/* ELIMINAR */}
                                    <ButtonAction
                                        text="Eliminar"
                                        onClick={() => handleEliminar(p.id)}
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
                    onClick={() => setPagina((prev) => prev - 1)}
                />

                <span className="pagina-info">
                    Página {pagina} / {totalPaginas}
                </span>

                <ButtonAction
                    text="Siguiente"
                    disabled={pagina >= totalPaginas}
                    onClick={() => setPagina((prev) => prev + 1)}
                />
            </div>
        </div>
    );
}
