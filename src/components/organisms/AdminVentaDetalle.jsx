import React from "react";
import { ButtonAction } from "../components/atoms/ButtonAction";

export default function AdminVentaDetalle({ venta, onCerrar }) {
    return (
        <div className="modal-bg">
            <div className="modal-content">

                <h2>Detalle de Venta #{venta.id}</h2>

                <p><strong>Usuario:</strong> {venta.usuario?.nombreCompleto}</p>
                <p><strong>Método de Pago:</strong> {venta.metodoPago?.nombre}</p>
                <p><strong>Método de Envío:</strong> {venta.metodoEnvio?.nombre}</p>
                <p><strong>Estado:</strong> {venta.estado}</p>
                <p><strong>Fecha:</strong> {venta.fechaCompra}</p>
                <p><strong>Hora:</strong> {venta.horaCompra}</p>
                <p><strong>Total Final:</strong> ${venta.totalVenta?.toLocaleString()}</p>

                <h3>Productos Comprados</h3>
                <table className="tabla-admin">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {venta.detalles?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.producto?.nombre}</td>
                                <td>{item.cantidad}</td>
                                <td>${item.precioUnitario?.toLocaleString()}</td>
                                <td>${item.subtotal?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ButtonAction text="Cerrar" onClick={onCerrar} />
            </div>
        </div>
    );
}
