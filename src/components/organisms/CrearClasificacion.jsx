// Se importa React y useState para manejar estados internos
import React, { useState } from "react";

// Se importan las funciones del backend para crear y editar clasificaciones
import { crearClasificacion, editarClasificacion } from "../../services/clasificaciones";

// Input de texto reutilizable
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearClasificacion
 *
 * Este componente se usa para dos fines:
 *  - Crear una nueva clasificación.
 *  - Editar una clasificación existente.
 *
 * Los comportamientos dependen de la prop "modo":
 *    modo === "crear"  -> crea una nueva clasificación
 *    modo === "editar" -> edita la clasificación enviada por props
 *
 * Parámetros (props):
 *  - modo: "crear" o "editar"
 *  - clasificacion: objeto con los datos cuando se está editando
 *  - onCerrar: función para cerrar el modal cuando se termina
 */
export default function CrearClasificacion({ modo, clasificacion, onCerrar }) {
  /**
   * Estado principal del formulario
   * Se inicializa con los valores de la clasificación si estamos en modo edición
   */
  const [form, setForm] = useState({
    nombre: clasificacion?.nombre || "",
    descripcion: clasificacion?.descripcion || "",
    activo: clasificacion?.activo ?? true,
  });

  // Guarda mensajes de error específicos por campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza los valores del formulario cuando el usuario escribe.
   * Maneja inputs de texto y también checkbox.
   * Limpia errores del campo editado.
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
   * Se encarga de validar los campos:
   *  - nombre: obligatorio, máximo 50 caracteres
   *  - descripción: opcional, máximo 255 caracteres
   *
   * Devuelve true si todo está correcto.
   * Devuelve false si hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    // Validación del nombre
    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 50) {
      err.nombre = "Máximo 50 caracteres";
      ok = false;
    }

    // Validación de la descripción
    if (form.descripcion && form.descripcion.length > 255) {
      err.descripcion = "La descripción no puede superar los 255 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Maneja el envío del formulario.
   * Si la validación pasa, construye el payload y:
   *  - crea la clasificación, o
   *  - edita la clasificación
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return; // Si falla validación, no continúa

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearClasificacion(payload);
        alert("Clasificación creada con éxito!");
      } else {
        await editarClasificacion(clasificacion.id, payload);
        alert("Clasificación editada correctamente!");
      }

      // Cierra el modal
      onCerrar();
    } catch (err) {
      alert(err.message); // Muestra el error del backend
    }
  };

  /**
   * Render del modal.
   * Contiene:
   *  - título dinámico
   *  - formulario con nombre, descripción y estado
   *  - botones Guardar / Cancelar
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Clasificación" : "Editar Clasificación"}</h2>

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

          {/* Campo Activo */}
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          {/* Botones de acción */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Cancelar" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}
