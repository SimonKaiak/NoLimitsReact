import React, { useState } from "react";
import { crearDetalleVenta } from "../../services/ventas";

export default function CrearDetalleVenta({ ventaId, onFinish }) {
  const [form, setForm] = useState({
    productoId: "",
    cantidad: 1,
    precioUnitario: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      venta: { id: ventaId },
      producto: { id: Number(form.productoId) },
      cantidad: Number(form.cantidad),
      precioUnitario: Number(form.precioUnitario)
    };

    try {
      await crearDetalleVenta(payload);
      onFinish && onFinish();
    } catch (err) {
      alert("Error detalle: " + err.message);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h4>Agregar producto</h4>
      <input name="productoId" placeholder="ID Producto" onChange={handleChange} required />
      <input name="cantidad" type="number" onChange={handleChange} required />
      <input name="precioUnitario" type="number" onChange={handleChange} required />
      <button className="admin-btn">Agregar</button>
    </form>
  );
}