// Ruta: src/components/organisms/AccionCompra.jsx
import React from "react";
import { ButtonAction } from "../atoms/ButtonAction";
import { DetallesCompra } from "./DetallesCompra";
import { MensajeConfirmacion } from "../molecules/MensajeConfirmacion";
import { useNavigate } from "react-router-dom";

/**
 * Componente que agrupa la vista del comprobante de compra.
 */
export const AccionCompra = ({ producto, precio, fecha }) => {
  const navigate = useNavigate();

  const volverInicio = () => navigate("/principal");

  return (
    <section className="accion-compra">
      <MensajeConfirmacion />
      <DetallesCompra producto={producto} precio={precio} fecha={fecha} />
      <ButtonAction text="Volver al inicio" onClick={volverInicio} />
    </section>
  );
};