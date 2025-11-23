// Ruta: src/components/organisms/PaymentSection.jsx
import React, { useState } from "react";
import { PaymentMethodList } from "../molecules/PaymentMethodList";
import { ButtonSubmit } from "../atoms/ButtonSubmit";
import "../../styles/paymentMethodCard.css";
import { useNavigate } from "react-router-dom";
import { ButtonAction } from "../atoms/ButtonAction";

export const PaymentSection = ({ pago }) => {
  const [metodo, setMetodo] = useState(null);
  const [tarjeta, setTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [onepayPin, setOnePayPin] = useState("");
  const [mostrarPin, setMostrarPin] = useState(false);
  const navigate = useNavigate();

  const handlePagar = () => {
    if (!metodo) {
      alert("Debes seleccionar un método de pago");
      return;
    }

    // Validación tarjetas
    if (metodo === "tarjetas") {
      if (!tarjeta || tarjeta.replace(/\s/g, "").length < 16) {
        alert("Número de tarjeta inválido");
        return;
      }

      if (!vencimiento || vencimiento.length !== 5) {
        alert("Debes ingresar la fecha de vencimiento (MM/AA)");
        return;
      }

      const [mm, yy] = vencimiento.split("/").map(Number);
      const hoy = new Date();
      const currentYear = hoy.getFullYear() % 100;
      const currentMonth = hoy.getMonth() + 1;

      if (mm < 1 || mm > 12) {
        alert("El mes de vencimiento es inválido");
        return;
      }

      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        alert("La tarjeta está vencida");
        return;
      }
    }

    // Validación OnePay
    if (metodo === "onepay") {
      if (onepayPin.length !== 5) {
        alert("El PIN de OnePay debe tener 5 dígitos");
        return;
      }
    }

    // ================== DATOS PARA EL COMPROBANTE ==================

    // Obtener carrito real (ajusta la clave si usas otra)
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Formatear productos comprados
    const productos = carrito.map((item) => ({
      nombre: item.nombre || item.titulo || item.producto || item.name,
      cantidad: item.cantidad || 1,
    }));

    // Objeto unificado que usará el comprobante
    const compraRealizada = {
      productos,                             // lista real de productos
      productoNombre: "Compra NoLimits",     // etiqueta opcional
      precio: pago.total,
      fecha: new Date().toLocaleDateString("es-CL"),
      orden: "NL" + Date.now(),
      correo: pago.correoUsuario || "usuario@gmail.com",
    };

    localStorage.setItem("compra", JSON.stringify(compraRealizada));

    // (Opcional) limpiar carrito y total
    // localStorage.removeItem("carrito");
    // localStorage.removeItem("totalCompra");

    navigate("/comprobante");
  };

  return (
    <div className="payment-container">
      <div className="info-box">
        <h2>Estás pagando</h2>
        <p className="producto-nombre">Total a pagar</p>
        <p className="monto">
          ${pago.total.toLocaleString("es-CL")}
        </p>
      </div>

      <h3>Selecciona tu método de pago</h3>

      <div className="payment-row">
        <div className="payment-col payment-col-left">
          <PaymentMethodList selected={metodo} onSelect={setMetodo} />
        </div>

        <div
          className={`payment-col payment-col-right ${
            metodo === "onepay" ? "onepay-active" : ""
          }`}
        >
          {metodo === "tarjetas" && (
            <>
              <label>Número de Tarjeta</label>
              <input
                className="input-tarjeta"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                value={tarjeta}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
                  setTarjeta(formatted);
                }}
              />

              <label>Fecha de vencimiento (MM/AA)</label>
              <input
                className="input-tarjeta"
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                value={vencimiento}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (val.length >= 3) {
                    val = val.slice(0, 2) + "/" + val.slice(2);
                  }
                  setVencimiento(val);
                }}
              />
            </>
          )}

          {metodo === "onepay" && (
            <>
              <label>PIN de OnePay</label>
              <div className="pin-wrapper">
                <input
                  className="input-tarjeta"
                  type={mostrarPin ? "text" : "password"}
                  placeholder="Ingresa tu PIN"
                  maxLength={5}
                  value={onepayPin}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setOnePayPin(cleaned);
                  }}
                />

                <ButtonAction
                  text={mostrarPin ? "🙈" : "👁️"}
                  variant="icon"
                  onClick={() => setMostrarPin(!mostrarPin)}
                  className="btn-ver-pin"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <ButtonSubmit
        text="Pagar ahora"
        onClick={handlePagar}
        className="btn-pagar-ahora"
      />
    </div>
  );
};