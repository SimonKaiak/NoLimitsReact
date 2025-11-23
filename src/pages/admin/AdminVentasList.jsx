import React, { useEffect, useState } from "react";
import { listarVentas, obtenerVenta } from "../../services/ventas";
import CrearVenta from "../../components/organisms/CrearVenta";
import CrearDetalleVenta from "../../components/organisms/CrearDetalleVenta";
import "../../styles/adminBase.css";

export default function AdminVentaList() {
  const [ventas, setVentas] = useState([]);
  const [ventaExpandida, setVentaExpandida] = useState(null);

  async function cargarVentas() {
    const data = await listarVentas();
    setVentas(data);
  }

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Ventas</h2>

      <CrearVenta onFinish={cargarVentas} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.fechaCompra}</td>
              <td>${v.totalVenta}</td>
              <td>{v.usuarioModel?.id}</td>
              <td>
                <button className="admin-btn" onClick={() => setVentaExpandida(v)}>
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaExpandida && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detalle venta #{ventaExpandida.id}</h3>

          {ventaExpandida.detalles?.map(d => (
            <p key={d.id}>
              Producto #{d.producto?.id} - {d.cantidad} x ${d.precioUnitario}
            </p>
          ))}

          <CrearDetalleVenta
            ventaId={ventaExpandida.id}
            onFinish={cargarVentas}
          />
        </div>
      )}
    </div>
  );
}