// Se importa React y useState para manejar estados internos del componente
import React, { useState } from "react";

// Se importan las funciones del backend para crear o editar un desarrollador
import {
  crearDesarrollador,
  editarDesarrollador,
} from "../../services/desarrolladores";

// Input de texto reutilizable
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearDesarrollador
 *
 * Este componente cumple dos funciones:
 *  - Crear un nuevo desarrollador.
 *  - Editar un desarrollador existente.
 *
 * Depende de la prop "modo":
 *    modo === "crear"  -> crea uno nuevo
 *    modo === "editar" -> edita el recibido por props
 *
 * Parámetros (props):
 *  - modo: indica si se está creando o editando
 *  - desarrollador: datos existentes cuando se edita
 *  - onCerrar: función que cierra el modal
 */
export default function CrearDesarrollador({ modo, desarrollador, onCerrar }) {
  /**
   * Estado del formulario
   * Se rellena con datos anteriores si estamos editando,
   * o queda en blanco si estamos creando.
   */
  const [form, setForm] = useState({
    nombre: desarrollador?.nombre || "",
    activo: desarrollador?.activo ?? true,
  });

  // Guarda mensajes de error por cada campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Se ejecuta cada vez que el usuario escribe o cambia un checkbox.
   * Actualiza el estado del formulario y limpia errores del campo editado.
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
   * Valida:
   *  - que el nombre no esté vacío
   *  - que no tenga más de 120 caracteres
   *
   * Devuelve:
   *  - true si todo está bien
   *  - false si hay errores
   */
  const validar = () => {
    const err = {};
    let ok = true;

    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 120) {
      err.nombre = "Máximo 120 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Se ejecuta cuando el usuario envía el formulario.
   * Si la validación pasa, arma el payload y llama al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return; // Evita enviar si hay errores

    const payload = {
      nombre: form.nombre.trim(),
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearDesarrollador(payload);
        alert("Desarrollador creado con éxito!");
      } else {
        await editarDesarrollador(desarrollador.id, payload);
        alert("Desarrollador editado correctamente!");
      }

      onCerrar(); // Cierra el modal después de guardar
    } catch (err) {
      alert(err.message); // Muestra error del backend
    }
  };

  /**
   * Render del componente
   *
   * Contiene:
   *  - título dinámico según el modo
   *  - formulario con:
   *      * nombre
   *      * activo (checkbox)
   *      * botones Guardar / Cancelar
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Desarrollador" : "Editar Desarrollador"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          {/* Checkbox de activo */}
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
