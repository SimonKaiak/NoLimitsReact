// Ruta: src/components/organisms/CrearProducto.jsx

import React, { useEffect, useState } from "react";
import { crearProducto, editarProducto } from "../../services/productos";

export default function CrearProducto({
  modo = "crear",            // "crear" | "editar"
  productoInicial = null,    // objeto producto cuando editas
  onFinish,                  // callback luego de crear/editar
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    tipoProductoId: "",
    clasificacionId: "",
    estadoId: "",
  });

  const [error, setError] = useState("");

  // Cargar datos cuando se edita
  useEffect(() => {
    if (productoInicial) {
      setFormData({
        nombre: productoInicial.nombre ?? "",
        precio: productoInicial.precio ?? "",
        tipoProductoId: productoInicial.tipoProducto?.id ?? "",
        clasificacionId: productoInicial.clasificacion?.id ?? "",
        estadoId: productoInicial.estado?.id ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        precio: "",
        tipoProductoId: "",
        clasificacionId: "",
        estadoId: "",
      });
    }
  }, [productoInicial, modo]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      tipoProducto: { id: Number(formData.tipoProductoId) },
      clasificacion: formData.clasificacionId
        ? { id: Number(formData.clasificacionId) }
        : null,
      estado: { id: Number(formData.estadoId) },
    };

    try {
      if (modo === "editar" && productoInicial?.id) {
        await editarProducto(productoInicial.id, payload);
      } else {
        await crearProducto(payload);
      }

      if (onFinish) onFinish();
    } catch (err) {
      console.error(err);
      setError("Error al guardar: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{modo === "editar" ? "Editar producto" : "Crear producto"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="tipoProductoId"
        placeholder="ID tipoProducto (obligatorio)"
        value={formData.tipoProductoId}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="clasificacionId"
        placeholder="ID clasificación (opcional)"
        value={formData.clasificacionId}
        onChange={handleChange}
      />

      <input
        type="number"
        name="estadoId"
        placeholder="ID estado (obligatorio)"
        value={formData.estadoId}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {modo === "editar" ? "Guardar cambios" : "Guardar"}
      </button>
    </form>
  );
}