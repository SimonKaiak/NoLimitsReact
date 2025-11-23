import React, { useEffect, useState } from "react";
import "../../styles/detalleCompra.css";

export const DetallesCompra = ({ precio, fecha }) => {

  const [productoComprado, setProductoComprado] = useState("No definido");

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("CART")) || [];

    if (carrito.length > 0) {
      // Tomamos el primer producto comprado (o el último)
      setProductoComprado(carrito[0].nombre || carrito[0].titulo || "Producto");
    }
  }, []);

  return (
    <div className="detalles-compra">
      <h3>Detalles de la compra</h3>

      <p><strong>Producto:</strong> {productoComprado}</p>

      <p>
        <strong>Precio:</strong> ${Number(precio || 0).toLocaleString("es-CL")}
      </p>

      <p><strong>Fecha:</strong> {fecha}</p>
    </div>
  );
};