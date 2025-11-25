// Importamos React y useState/useEffect para manejar estado y cargar datos
import React, { useEffect, useState } from "react";

// Funciones del backend para crear o editar usuarios
import { crearUsuario, editarUsuario } from "../../services/usuarios";

/**
 * Componente CrearUsuario
 *
 * Permite:
 *  - Crear un usuario nuevo
 *  - Editar un usuario existente
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - usuarioInicial: datos del usuario cuando se edita
 *  - onFinish: función que se ejecuta al guardar
 */
export default function CrearUsuario({
  modo = "crear",
  usuarioInicial = null,
  onFinish,
}) {
  /**
   * formData almacena los valores del formulario.
   * Se inicializa vacío y luego, si se edita, se cargan los valores existentes.
   */
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    password: "",
    rolId: "",
  });

  // Mensaje de error para mostrar fallas del backend
  const [error, setError] = useState("");

  /**
   * useEffect
   *
   * Cuando usuarioInicial cambia:
   *  - Si existe, llenamos el formulario con esos datos.
   *  - Si no existe (modo crear), dejamos todo vacío.
   *
   * En edición, la contraseña NO se carga porque es un campo "WRITE_ONLY".
   */
  useEffect(() => {
    if (usuarioInicial) {
      setFormData({
        nombre: usuarioInicial.nombre ?? "",
        apellidos: usuarioInicial.apellidos ?? "",
        correo: usuarioInicial.correo ?? "",
        telefono: usuarioInicial.telefono ?? "",
        password: "", // nunca se trae desde el backend
        rolId: usuarioInicial.rol?.id ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        apellidos: "",
        correo: "",
        telefono: "",
        password: "",
        rolId: "",
      });
    }
  }, [usuarioInicial, modo]);

  /**
   * handleChange
   *
   * Actualiza el estado formData cuando el usuario escribe en un input.
   */
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  /**
   * handleSubmit
   *
   * - Evita recargar la página
   * - Limpia errores anteriores
   * - Construye el objeto `payload` para enviar al backend
   * - En modo crear: SIEMPRE se manda password
   * - En modo editar: solo se manda password si el usuario escribe algo nuevo
   * - Llama al servicio según el modo
   * - Ejecuta onFinish al terminar
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      telefono: Number(formData.telefono),
      rol: { id: Number(formData.rolId) },
    };

    // En creación siempre se requiere password.
    // En edición solo se envía si no está vacío.
    if (modo === "crear" || formData.password.trim() !== "") {
      payload.password = formData.password;
    }

    try {
      if (modo === "editar" && usuarioInicial?.id) {
        await editarUsuario(usuarioInicial.id, payload);
      } else {
        await crearUsuario(payload);
      }

      if (onFinish) onFinish();

    } catch (err) {
      console.error(err);
      setError("Error al guardar usuario: " + err.message);
    }
  }

  /**
   * Render del formulario.
   *
   * Incluye:
   *  - Campos de texto (nombre, apellidos)
   *  - Correo
   *  - Teléfono
   *  - Contraseña (obligatoria solo al crear)
   *  - ID de rol
   *  - Botón de guardar
   */
  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {/* Mensaje de error global */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="admin-form-row">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={
            modo === "crear"
              ? "Contraseña (máx 10)"
              : "Nueva contraseña (opcional)"
          }
          value={formData.password}
          onChange={handleChange}
          required={modo === "crear"}
          maxLength={10}
        />

        <input
          type="number"
          name="rolId"
          placeholder="ID rol (obligatorio)"
          value={formData.rolId}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {modo === "editar" ? "Guardar cambios" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
