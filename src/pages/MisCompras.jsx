import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisCompras } from "../services/ventas";
import "../styles/misCompras.css";

// Formateo CLP
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

export default function MisCompras() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estado para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 2; 

  useEffect(() => {
    obtenerMisCompras()
      .then((data) => {
        setVentas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("ERROR AL CARGAR COMPRAS:", err);
        setVentas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mis-compras-wrapper">
        <h1 className="mis-compras-title">🧾 Mis Compras</h1>
        <p className="loading-text">Cargando historial...</p>
      </div>
    );
  }

  const lista = Array.isArray(ventas) ? ventas : [];

  // Calcular total de páginas
  const totalPaginas = Math.ceil(lista.length / itemsPorPagina);

  // Calcular datos de la página actual
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const ventasPagina = lista.slice(indiceInicio, indiceFin);

  return (
    <div className="mis-compras-wrapper">
      <h1 className="mis-compras-title">🧾 Mis Compras</h1>

      {lista.length === 0 && (
        <>
          <p className="mensaje">No tienes compras registradas.</p>
          <p className="mensaje">
            Cuando realices una compra, aparecerá aquí el resumen de tu pedido.
          </p>
        </>
      )}

      {/*Renderizar solo las compras de la página actual */}
      {ventasPagina.map((venta) => (
        <article key={venta.id} className="compra-card">
          <header className="compra-header">
            <h2>Compra #{venta.id ?? "?"}</h2>
            <span>
              {venta.fechaCompra ?? "Fecha N/A"} {venta.horaCompra ?? ""}
            </span>
          </header>

          <section className="compra-detalle">
            <p><strong>Estado:</strong> {venta.estado?.nombre || "N/A"}</p>
            <p><strong>Método de pago:</strong> {venta.metodoPagoModel?.nombre || "N/A"}</p>
            <p><strong>Método de envío:</strong> {venta.metodoEnvioModel?.nombre || "N/A"}</p>
          </section>

          <ul className="lista-productos">
            {Array.isArray(venta.detalles) && venta.detalles.length > 0 ? (
              venta.detalles.map((det) => (
                <li key={det.id} className="item-producto">
                  <p><strong>{det.producto?.nombre || "Producto"}</strong></p>
                  <p>Cantidad: {det.cantidad || 0}</p>
                  <p>Subtotal: {clp(det.subtotal)}</p>
                </li>
              ))
            ) : (
              <li className="item-producto">
                <p>Sin detalles registrados para esta compra.</p>
              </li>
            )}
          </ul>

          <div className="total-compra">Total: {clp(venta.totalVenta)}</div>
        </article>
      ))}

      {/*PAGINACIÓN */}
      {lista.length > 0 && (
        <div className="paginacion">
          <button
            className="btn btn-secondary"
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>

          <span className="pagina-info">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Botón volver */}
      <p className="mensaje">
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/principal")}
        >
          Volver a la tienda
        </button>
      </p>
    </div>
  );
}