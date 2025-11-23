import React, { useEffect, useState } from "react";
import { ButtonAction } from "../components/atoms/ButtonAction";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../styles/detalleCompra.css";

export const Comprobante = () => {
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const handleVolver = () => {
    // Limpiar carrito y total
    localStorage.removeItem("carrito");
    localStorage.removeItem("totalCompra");

    // También puedes limpiar la compra si no quieres que persista
    // localStorage.removeItem("compra");

    navigate("/principal");
    };


  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("compra"));
  if (data) setCompra(data);

  const userData = JSON.parse(localStorage.getItem("nl_user"));
  if (userData) setUsuario(userData);
}, []);


  if (!compra) {
    return (
      <div className="loading-overlay">
        <p className="cargando">Cargando comprobante...</p>
      </div>
    );
  }

const handleDescargar = () => {
  const element = document.getElementById("zona-comprobante");
  if (!element) return;

  // Activar modo PDF
  element.classList.add("pdf-mode");

  const opciones = {
    margin: 0.5,
    filename: `Comprobante_${compra.orden}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      backgroundColor: null // ← mantiene tu fondo original
    },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf()
    .set(opciones)
    .from(element)
    .save()
    .then(() => {
      // Restaurar vista normal
      element.classList.remove("pdf-mode");
    });
};



  // Tomamos los productos reales
  const productos = Array.isArray(compra.productos) ? compra.productos : [];

  return (
    <div className="comprobante-page">
    <div className="comprobante-container-carrusel" id="zona-comprobante">
        <h2>¡Felicidades, el pago se ha realizado con éxito!</h2>
        <p>Gracias por confiar en NoLimits :)</p>

        <div className="detalle-section">
            <h3>Detalle del pago:</h3>
            <p><strong>Comercio:</strong> NoLimits</p>

            {/* AQUÍ ESTÁ LA CLAVE */}
            <p><strong>Producto(s):</strong></p>
            {productos.length > 0 ? (
                <ul className="lista-productos-compra">
                {productos.map((p, index) => (
                    <li key={index}>
                    {p.nombre} {p.cantidad ? `x${p.cantidad}` : ""}
                    </li>
                ))}
                </ul>
            ) : (
                <p>{compra.productoNombre}</p>
            )}

            <p><strong>Orden de pago:</strong> #{compra.orden}</p>
            <p><strong>Fecha:</strong> {compra.fecha}</p>
                <p>
                <strong>Correo:</strong> {usuario?.correo || "No disponible"}
                </p>          
            <p>
                <strong>Monto:</strong>{" "}
                ${Number(compra.precio || 0).toLocaleString("es-CL")}
            </p>
        </div>

        <div className="botones-container">
          <ButtonAction
            text="Descargar comprobante"
            onClick={handleDescargar}
            className="btn-descargar-comprobante"
          />
          <ButtonAction
            text="Volver al inicio"
            onClick={handleVolver}
            className="btn-volver-inicio"
          />
        </div>
      </div>
    </div>
  );
};