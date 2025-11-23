import React, { useEffect, useState } from "react";
import "../styles/misCompras.css";
import { obtenerMisCompras } from "../services/usuarios";

export default function MisCompras() {

    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarCompras();
    }, []);

    async function cargarCompras() {
        setLoading(true);

        try {
            const usuarioId = Number(localStorage.getItem("nl_user_id"));
            const data = await obtenerMisCompras(usuarioId);
            setCompras(data || []);
        } catch (err) {
            console.error(err);
            alert("❌ Error al cargar tus compras");
        }

        setLoading(false);
    }

    if (loading) {
        return <p className="loading-text">Cargando compras...</p>;
    }

    return (
        <div className="mis-compras-wrapper">

            <h1 className="mis-compras-title">Mis Compras</h1>

            {compras.length === 0 && (
                <p className="mensaje">No tienes compras registradas.</p>
            )}

            {compras.map((venta) => (
                <div key={venta.id} className="compra-card">

                    {/* Header */}
                    <div className="compra-header">
                        <h2>Compra #{venta.id}</h2>
                        <p>
                            Fecha: {venta.fecha}
                            <br />
                            Hora: {venta.hora}
                        </p>
                    </div>

                    {/* Métodos */}
                    <div className="compra-detalle">
                        <p><strong>Método pago:</strong> {venta.metodoPago?.nombre}</p>
                        <p><strong>Método envío:</strong> {venta.metodoEnvio?.nombre}</p>
                        <p><strong>Estado:</strong> {venta.estado?.nombre}</p>
                    </div>

                    <h3>Productos</h3>

                    <ul className="lista-productos">
                        {venta.detalles?.map((item) => (
                            <li key={item.id} className="item-producto">
                                <p><strong>{item.producto?.nombre}</strong></p>
                                <p>Cantidad: {item.cantidad}</p>
                                <p>Precio unitario: ${item.precioUnitario?.toLocaleString()}</p>
                                <p>Subtotal: ${item.subtotal?.toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="total-compra">
                        Total: ${venta.total?.toLocaleString()}
                    </div>

                </div>
            ))}
        </div>
    );
}
