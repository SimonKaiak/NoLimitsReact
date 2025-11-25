// Se importa React y el hook useState para manejar estados del formulario
import React, { useEffect, useState } from "react";

// Servicios del backend para crear o editar tipos de producto
import { crearTipoProducto, editarTipoProducto } from "../../services/tiposProducto";

// Input reutilizable para texto
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearTipoProducto
 *
 * Permite:
 *  - Crear un nuevo tipo de producto (ej: "Juego digital", "Accesorio", etc.)
 *  - Editar un tipo de producto existente
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - tipo: objeto con datos existentes (solo en edición)
 *  - onCerrar: función que cierra el modal al terminar
 */
export default function CrearTipoProducto({ modo, tipo, onCerrar }) {
  /**
   * Estado del formulario.
   * Campos:
   *  - nombre: texto obligatorio
   *  - descripcion: opcional
   *  - activo: booleano
   *
   * Si estamos editando, se cargan los datos desde "tipo".
   */
  const [form, setForm] = useState({
    nombre: tipo?.nombre || "",
    descripcion: tipo?.descripcion || "",
    activo: tipo?.activo ?? true,
  });

  // Estado para mostrar errores de validación
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza el formulario según el campo editado.
   * Si hay un error previo en ese campo, lo limpia.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * validar
   *
   * Reglas:
   *  - nombre obligatorio, mínimo 2 y máximo 100 caracteres
   *  - descripción opcional, máximo 255 caracteres
   *
   * Devuelve true si no hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    // Validación del nombre
    if (!form.nombre || form.nombre.trim().length < 2) {
      err.nombre = "Nombre obligatorio (2-100 caracteres)";
      ok = false;
    }

    if (form.nombre.trim().length > 100) {
      err.nombre = "El nombre no puede superar 100 caracteres";
      ok = false;
    }

    // Validación de descripción
    if (form.descripcion && form.descripcion.length > 255) {
      err.descripcion = "La descripción no puede superar 255 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Se ejecuta al enviar el formulario:
   *  1. Valida los datos.
   *  2. Construye el payload.
   *  3. Llama al backend para crear o editar.
   *  4. Cierra el modal al terminar.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearTipoProducto(payload);
        alert("Tipo de producto creado con éxito!");
      } else {
        await editarTipoProducto(tipo.id, payload);
        alert("Tipo de producto editado correctamente!");
      }

      onCerrar(); // Cierra modal

    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del modal con el formulario.
   *
   * Incluye:
   *  - Campo nombre
   *  - Campo descripción
   *  - Checkbox activo
   *  - Botones Guardar y Cancelar
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>
          {modo === "crear"
            ? "Crear Tipo de Producto"
            : "Editar Tipo de Producto"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          {/* Campo Descripción */}
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
          {errores.descripcion && (
            <p className="error-msg">{errores.descripcion}</p>
          )}

          {/* Checkbox Activo */}
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          {/* Botones */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Cancelar" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}
