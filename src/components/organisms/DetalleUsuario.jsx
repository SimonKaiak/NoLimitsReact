import React from "react";
import { ButtonAction } from "../atoms/ButtonAction";

export default function DetalleUsuario({ usuario, onCerrar }) {

    const totalCompras = usuario.ventasAsociadas?.length ?? 0;

    return (
        <div className="modal-bg">
            <div className="modal-content detalle-usuario">

                <h2>Detalle del Usuario</h2>

                <p><strong>Nombre completo:</strong> {usuario.nombreCompleto}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Teléfono:</strong> {usuario.telefono}</p>

                <p>
                    <strong>Dirección:</strong>  
                    {usuario.comuna?.nombre}, {usuario.region?.nombre}
                </p>

                {/* TÍTULO CAMBIADO */}
                <h3>Compras del Usuario</h3>

                {/* CANTIDAD REAL DE COMPRAS */}
                <p>
                    <strong>Total de compras:</strong> {totalCompras}
                </p>

                {totalCompras === 0 && (
                    <p>No tiene compras asociadas.</p>
                )}

                {usuario.ventasAsociadas?.map((v) => (
                    <div key={v.id} className="venta-card">
                        <p><strong>ID compra:</strong> {v.id}</p>
                        <p><strong>Fecha:</strong> {v.fechaCompra}</p>
                        <p><strong>Hora:</strong> {v.horaCompra}</p>
                        <p><strong>Subtotal:</strong> ${v.subtotal}</p>
                        <p><strong>Total:</strong> ${v.totalVenta}</p>
                        <p><strong>Método Pago:</strong> {v.metodoPago?.nombre}</p>
                        <p><strong>Método Envío:</strong> {v.metodoEnvio?.nombre}</p>
                        <hr />
                    </div>
                ))}

                <ButtonAction text="Cerrar" onClick={onCerrar} />
            </div>
        </div>
    );
}