import React from "react";
import Footer from "../components/organisms/Footer.jsx";
import Navbar from "../components/organisms/Navbar.jsx";
import { PaymentSection } from "../components/organisms/PaymentSection.jsx";
import "../styles/paymentMethodCard.css";

const PaymentMethod = () => {

  const storedTotal = localStorage.getItem("totalCompra");
  const total = storedTotal ? Number(storedTotal) : 0;

  // Obtenemos productos del carrito
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Formateamos los productos para el comprobante
  const productos = carrito.map(item => ({
    nombre: item.nombre || item.titulo || item.producto,
    cantidad: item.cantidad || 1
  }));

  const pago = {
    total,
    correoUsuario: "usuario@gmail.com",
    productos
  };

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <PaymentSection pago={pago} />
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethod;