import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMisCompras } from "../services/ventas";
import "../styles/misCompras.css";

// Función auxiliar para formatear montos en pesos chilenos.
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

export default function MisCompras() {
  // Guarda la lista de ventas del usuario.
  const [ventas, setVentas] = useState([]);
  // Indica si todavía se está cargando la información desde el backend.
  const [loading, setLoading] = useState(true);
  // Hook para poder navegar a otras rutas.
  const navigate = useNavigate();

  // Cuando se monta el componente, se consulta al backend las compras del usuario.
  useEffect(() => {
    obtenerMisCompras()
      .then((data) => {
        console.log("MisCompras data:", data);
        // Si la respuesta es un arreglo, la usamos. Si no, dejamos la lista vacía para evitar errores.
        setVentas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        // Si ocurre un error, lo mostramos en consola y dejamos la lista vacía.
        console.error("ERROR AL CARGAR COMPRAS:", err);
        setVentas([]);
      })
      .finally(() => setLoading(false)); // Aquí marcamos que la carga terminó, haya salido bien o mal.
  }, []);

  // Mientras los datos se están cargando, mostramos un mensaje simple en pantalla.
  if (loading) {
    return (
      <div className="mis-compras-wrapper">
        <h1 className="mis-compras-title">🧾 Mis Compras</h1>
        <p className="loading-text">Cargando historial...</p>
      </div>
    );
  }

  // Nos aseguramos de que "ventas" sea un arreglo antes de iterar sobre él.
  const lista = Array.isArray(ventas) ? ventas : [];

  return (
    <div className="mis-compras-wrapper">
      <h1 className="mis-compras-title">🧾 Mis Compras</h1>

      {/* Si no hay compras, mostramos un mensaje explicando que el historial está vacío. */}
      {lista.length === 0 && (
        <>
          <p className="mensaje">No tienes compras registradas.</p>
          <p className="mensaje">
            Cuando realices una compra, aparecerá aquí el resumen de tu pedido.
          </p>
        </>
      )}

      {/* Recorremos la lista de ventas y mostramos cada compra como una tarjeta. */}
      {lista.map((venta) => (
        <article
          key={venta.id}
          className="compra-card"
        >
          {/* Encabezado de la tarjeta: número de compra y fecha/hora. */}
          <header className="compra-header">
            <h2>Compra #{venta.id ?? "?"}</h2>
            <span>
              {venta.fechaCompra ?? "Fecha N/A"}{" "}
              {venta.horaCompra ?? ""}
            </span>
          </header>

          {/* Sección con información general de la compra: estado, método de pago y envío. */}
          <section className="compra-detalle">
            <p>
              <strong>Estado:</strong>{" "}
              {venta.estado?.nombre || "N/A"}
            </p>
            <p>
              <strong>Método de pago:</strong>{" "}
              {venta.metodoPagoModel?.nombre || "N/A"}
            </p>
            <p>
              <strong>Método de envío:</strong>{" "}
              {venta.metodoEnvioModel?.nombre || "N/A"}
            </p>
          </section>

          {/* Lista de productos incluidos en la compra. */}
          <ul className="lista-productos">
            {Array.isArray(venta.detalles) && venta.detalles.length > 0 ? (
              venta.detalles.map((det) => (
                <li
                  key={det.id}
                  className="item-producto"
                >
                  <p>
                    <strong>{det.producto?.nombre || "Producto"}</strong>
                  </p>
                  <p>Cantidad: {det.cantidad || 0}</p>
                  <p>Subtotal: {clp(det.subtotal)}</p>
                </li>
              ))
            ) : (
              // Si la venta no tiene detalles, se muestra un mensaje por defecto.
              <li className="item-producto">
                <p>Sin detalles registrados para esta compra.</p>
              </li>
            )}
          </ul>

          {/* Total final de la compra, formateado en pesos chilenos. */}
          <div className="total-compra">
            Total: {clp(venta.totalVenta)}
          </div>
        </article>
      ))}

      {/* Botón para volver a la pantalla principal de la tienda. */}
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