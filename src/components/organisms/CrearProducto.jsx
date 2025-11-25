// Importa React y dos hooks: useState para manejar el formulario
// y useEffect para cargar datos cuando se edita un producto.
import React, { useEffect, useState } from "react";

// Funciones del backend para crear y editar productos
import { crearProducto, editarProducto } from "../../services/productos";

/**
 * Componente CrearProducto
 *
 * Se usa para crear o editar productos.
 * Internamente es el mismo formulario, pero cambia su comportamiento
 * dependiendo de la prop "modo" y si recibe un "productoInicial".
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - productoInicial: objeto producto cuando se está editando
 *  - onFinish: función que se ejecuta cuando termina de crear/editar
 */
export default function CrearProducto({
  modo = "crear",
  productoInicial = null,
  onFinish,
}) {
  /**
   * formData representa todos los datos del formulario.
   * Tiene:
   *  - nombre: texto
   *  - precio: número
   *  - tipoProductoId: id obligatorio
   *  - clasificacionId: id opcional
   *  - estadoId: id obligatorio
   */
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    tipoProductoId: "",
    clasificacionId: "",
    estadoId: "",
  });

  // Estado para mostrar errores de validación o del backend
  const [error, setError] = useState("");

  /**
   * useEffect
   *
   * Si productoInicial existe, significa que estamos editando.
   * Entonces se cargan los valores del producto para rellenar el formulario.
   *
   * Si no, se limpian los campos para crear uno nuevo.
   */
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

  /**
   * handleChange
   *
   * Esta función se ejecuta cada vez que el usuario escribe un valor nuevo.
   * Actualiza el campo que corresponde dentro de formData.
   */
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  /**
   * handleSubmit
   *
   * Se ejecuta cuando el formulario se envía.
   * 1. Evita que la página recargue.
   * 2. Limpia errores previos.
   * 3. Construye el payload en el formato que espera el backend.
   * 4. Llama a crearProducto o editarProducto según el modo.
   * 5. Ejecuta onFinish si se envió correctamente.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      tipoProducto: { id: Number(formData.tipoProductoId) },
      clasificacion: formData.clasificacionId
        ? { id: Number(formData.clasificacionId) }
        : null, // opcional
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

  /**
   * Render del formulario
   *
   * Todos los inputs son básicos aquí, sin componentes reutilizables.
   * Si hay un error, se muestra arriba del formulario.
   */
  return (
    <form onSubmit={handleSubmit}>
      <h3>{modo === "editar" ? "Editar producto" : "Crear producto"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Campo nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      {/* Campo precio */}
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />

      {/* ID tipoProducto (obligatorio) */}
      <input
        type="number"
        name="tipoProductoId"
        placeholder="ID tipoProducto (obligatorio)"
        value={formData.tipoProductoId}
        onChange={handleChange}
        required
      />

      {/* ID clasificación (opcional) */}
      <input
        type="number"
        name="clasificacionId"
        placeholder="ID clasificación (opcional)"
        value={formData.clasificacionId}
        onChange={handleChange}
      />

      {/* ID estado (obligatorio) */}
      <input
        type="number"
        name="estadoId"
        placeholder="ID estado (obligatorio)"
        value={formData.estadoId}
        onChange={handleChange}
        required
      />

      {/* Botón de envío */}
      <button type="submit">
        {modo === "editar" ? "Guardar cambios" : "Guardar"}
      </button>
    </form>
  );
}
