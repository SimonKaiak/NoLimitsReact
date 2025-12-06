
// Ruta: src/components/organisms/CrearProducto.jsx
import React, { useEffect, useState } from "react";

// Servicios del recurso Producto (crear / editar)
import { crearProducto, editarProducto } from "../../services/productos";

// Servicios de catálogos (desde el mismo productos.js)
import {
  obtenerTiposProducto,
  obtenerClasificaciones,
  obtenerEstadosProducto as obtenerEstados,
} from "../../services/productos";

export default function CrearProducto({
  modo = "crear",
  productoInicial = null,
  onFinish,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    tipoProductoId: "",
    clasificacionId: "",
    estadoId: "",
    saga: "",
    portadaSaga: "",
  });

  const [error, setError] = useState("");

  // Catálogos
  const [tipos, setTipos] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [estados, setEstados] = useState([]);

  // Cargar catálogos al iniciar
  useEffect(() => {
    async function cargar() {
      try {
        const [tiposData, clasifData, estadosData] = await Promise.all([
          obtenerTiposProducto(),
          obtenerClasificaciones(),
          obtenerEstados(),
        ]);

        setTipos(tiposData);
        setClasificaciones(clasifData);
        setEstados(estadosData);
      } catch (e) {
        console.error("Error cargando catálogos:", e);
      }
    }
    cargar();
  }, []);

  // Cargar datos si se edita
  useEffect(() => {
    if (productoInicial) {
      setFormData({
        nombre: productoInicial.nombre ?? "",
        precio: productoInicial.precio ?? "",
        tipoProductoId: productoInicial.tipoProductoId ?? "",
        clasificacionId: productoInicial.clasificacionId ?? "",
        estadoId: productoInicial.estadoId ?? "",
        saga: productoInicial.saga ?? "",
        portadaSaga: productoInicial.portadaSaga ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        precio: "",
        tipoProductoId: "",
        clasificacionId: "",
        estadoId: "",
        saga: "",
        portadaSaga: "",
      });
    }
  }, [productoInicial]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      tipoProductoId: Number(formData.tipoProductoId),
      clasificacionId: formData.clasificacionId
        ? Number(formData.clasificacionId)
        : null,
      estadoId: Number(formData.estadoId),
      saga: formData.saga || null,
      portadaSaga: formData.portadaSaga || null,
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

      {/* Nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      {/* Precio */}
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />

      {/* Tipo de producto */}
      <select
        name="tipoProductoId"
        value={formData.tipoProductoId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione tipo de producto</option>
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>

      {/* Clasificación */}
      <select
        name="clasificacionId"
        value={formData.clasificacionId}
        onChange={handleChange}
      >
        <option value="">Sin clasificación</option>
        {clasificaciones.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* Estado */}
      <select
        name="estadoId"
        value={formData.estadoId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione estado</option>
        {estados.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>

      {/* Saga */}
      <input
        type="text"
        name="saga"
        placeholder="Saga (opcional)"
        value={formData.saga}
        onChange={handleChange}
      />

      {/* Portada Saga */}
      <input
        type="text"
        name="portadaSaga"
        placeholder="URL portada saga (opcional)"
        value={formData.portadaSaga}
        onChange={handleChange}
      />

      <button type="submit">
        {modo === "editar" ? "Guardar cambios" : "Guardar"}
      </button>
    </form>
  );
}