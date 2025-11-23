import React, { useState } from "react";
import { crearVenta } from "../../services/ventas";

export default function CrearVenta({ onFinish }) {
  const [form, setForm] = useState({
    usuarioId: "",
    metodoPagoId: "",
    metodoEnvioId: "",
    estadoId: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      usuarioModel: { id: Number(form.usuarioId) },
      metodoPagoModel: { id: Number(form.metodoPagoId) },
      metodoEnvioModel: { id: Number(form.metodoEnvioId) },
      estado: { id: Number(form.estadoId) }
    };

    try {
      await crearVenta(payload);
      onFinish && onFinish();
      alert("Venta creada correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Crear Venta</h3>

      <input name="usuarioId" placeholder="ID Usuario" onChange={handleChange} required />
      <input name="metodoPagoId" placeholder="ID Método Pago" onChange={handleChange} required />
      <input name="metodoEnvioId" placeholder="ID Método Envío" onChange={handleChange} required />
      <input name="estadoId" placeholder="ID Estado" onChange={handleChange} required />

      <button className="admin-btn">Guardar venta</button>
    </form>
  );
}