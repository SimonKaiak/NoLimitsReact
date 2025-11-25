// Ruta: src/pages/admin/AdminVentaList.jsx

/**
 * Página administrativa para visualizar todas las ventas del sistema.
 *
 * Funciones principales:
 *  - Listar todas las ventas registradas.
 *  - Expandir una venta para ver sus detalles.
 *  - Mostrar productos, cantidades, precios y totales.
 *
 * Notas:
 *  - Es un módulo SOLO de consulta. Por estándar de negocio,
 *    las ventas generalmente NO se editan ni eliminan.
 */

import React, { useEffect, useState } from "react";
import { listarVentas } from "../../services/ventas";
import "../../styles/adminBase.css";

export default function AdminVentaList() {
  
  /** Lista total de ventas */
  const [ventas, setVentas] = useState([]);

  /** Venta seleccionada para mostrar su detalle */
  const [ventaExpandida, setVentaExpandida] = useState(null);

  /** Loading */
  const [loading, setLoading] = useState(false);

  /** Errores al cargar ventas */
  const [error, setError] = useState("");

  /**
   * Carga todas las ventas desde el backend.
   */
  async function cargarVentas() {
    setLoading(true);
    setError("");

    try {
      const data = await listarVentas();
      setVentas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("❌ Error al cargar ventas");
    }

    setLoading(false);
  }

  /** Carga inicial */
  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="admin-wrapper">

      <h2 className="admin-title">Ventas</h2>

      {/* ================= MENSAJES DE CARGA / ERROR ================= */}
      {loading && <p className="admin-msg">Cargando ventas...</p>}
      {error && <p className="admin-msg" style={{ color: "red" }}>{error}</p>}

      {/* ================= TABLA PRINCIPAL ================= */}
      {!loading && ventas.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Usuario</th>
              <th>Método de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>
                  {v.fechaCompra} <br />
                  <small>{v.horaCompra}</small>
                </td>
                <td>${v.totalVenta}</td>
                <td>{v.usuarioModel?.id ?? "N/A"}</td>
                <td>{v.metodoPagoModel?.nombre ?? "N/A"}</td>

                <td>
                  <button
                    className="admin-btn"
                    onClick={() => setVentaExpandida(v)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MENSAJE SI NO HAY VENTAS ================= */}
      {!loading && ventas.length === 0 && (
        <p className="admin-msg">No hay ventas registradas.</p>
      )}

      {/* ================= DETALLE DE VENTA ================= */}
      {ventaExpandida && (
        <div style={{ marginTop: "30px" }}>
          <h3 className="admin-title" style={{ fontSize: "20px" }}>
            Detalle de la Venta #{ventaExpandida.id}
          </h3>

          {/* Resumen superior */}
          <div className="admin-box">
            <p><strong>Fecha:</strong> {ventaExpandida.fechaCompra}</p>
            <p><strong>Hora:</strong> {ventaExpandida.horaCompra}</p>
            <p><strong>Total:</strong> ${ventaExpandida.totalVenta}</p>
            <p><strong>Método de Pago:</strong> {ventaExpandida.metodoPagoModel?.nombre}</p>
            <p><strong>ID Usuario:</strong> {ventaExpandida.usuarioModel?.id}</p>
          </div>

          {/* Tabla de detalles */}
          <table className="admin-table" style={{ marginTop: "15px" }}>
            <thead>
              <tr>
                <th>ID Detalle</th>
                <th>ID Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {ventaExpandida.detalles?.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.producto?.id}</td>
                  <td>{d.cantidad}</td>
                  <td>${d.precioUnitario}</td>
                  <td>${d.cantidad * d.precioUnitario}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botón cerrar */}
          <button
            className="admin-btn-secondary"
            style={{ marginTop: "15px" }}
            onClick={() => setVentaExpandida(null)}
          >
            Cerrar detalle
          </button>
        </div>
      )}

    </div>
  );
}
