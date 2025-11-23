import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import { listarVentas, obtenerVenta } from "../../services/ventas";
import AdminVentaDetalle from "./AdminVentasList.jsx";

export default function AdminVentasList() {

    const [ventas, setVentas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);

    const [busqueda, setBusqueda] = useState("");
    const [estado, setEstado] = useState("");

    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    useEffect(() => {
        cargarVentas();
    }, [pagina, busqueda, estado]);

    async function cargarVentas() {
        setLoading(true);

        try {
            const data = await listarVentas(pagina, busqueda, estado);
            setVentas(data.contenido || []);
            setTotalPaginas(data.totalPaginas || 1);
        } catch (err) {
            console.error(err);
            alert("❌ Error cargando ventas");
        }

        setLoading(false);
    }

    const abrirDetalle = async (venta) => {
        try {
            const full = await obtenerVenta(venta.id);
            setVentaSeleccionada(full);
        } catch (err) {
            alert("❌ Error cargando detalle");
        }
    };

    return (
        <div className="admin-wrapper">

            <h1 className="admin-title">Listado de Ventas</h1>

            {/* Filtros */}
            <div className="admin-form">

                <input
                    type="text"
                    placeholder="Buscar por usuario, fecha o ID..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPagina(1);
                    }}
                    className="admin-input"
                />

                <select
                    value={estado}
                    onChange={(e) => {
                        setEstado(e.target.value);
                        setPagina(1);
                    }}
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="CANCELADO">Cancelado</option>
                </select>

                <ButtonAction text="Buscar" onClick={() => setPagina(1)} />
            </div>

            {/* Tabla */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Usuario</th>
                        <th>Método de Pago</th>
                        <th>Método Envío</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr><td colSpan="9" className="admin-msg">Cargando...</td></tr>
                    ) : ventas.length === 0 ? (
                        <tr><td colSpan="9" className="admin-msg">No hay resultados</td></tr>
                    ) : (
                        ventas.map((v) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.fechaCompra}</td>
                                <td>{v.horaCompra}</td>
                                <td>{v.usuario?.nombreCompleto}</td>
                                <td>{v.metodoPago?.nombre}</td>
                                <td>{v.metodoEnvio?.nombre}</td>
                                <td>{v.estado}</td>
                                <td>${v.totalVenta?.toLocaleString()}</td>

                                <td>
                                    <ButtonAction
                                        text="Ver Detalle"
                                        onClick={() => abrirDetalle(v)}
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
                    onClick={() => setPagina(p => p - 1)}
                />

                <span className="admin-page-info">
                    Página {pagina} / {totalPaginas}
                </span>

                <ButtonAction
                    text="Siguiente"
                    disabled={pagina >= totalPaginas}
                    onClick={() => setPagina(p => p + 1)}
                />
            </div>

            {/* Detalle */}
            {ventaSeleccionada && (
                <AdminVentaDetalle
                    venta={ventaSeleccionada}
                    onCerrar={() => setVentaSeleccionada(null)}
                />
            )}

        </div>
    );
}
