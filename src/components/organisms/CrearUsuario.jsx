// Ruta: src/components/organisms/CrearUsuario.jsx

import React, { useEffect, useState } from "react";
import { crearUsuario, editarUsuario } from "../../services/usuarios";

export default function CrearUsuario({
  modo = "crear",         // "crear" | "editar"
  usuarioInicial = null,  // objeto Usuario cuando editas
  onFinish,               // callback después de crear/editar
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    password: "",
    rolId: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (usuarioInicial) {
      setFormData({
        nombre: usuarioInicial.nombre ?? "",
        apellidos: usuarioInicial.apellidos ?? "",
        correo: usuarioInicial.correo ?? "",
        telefono: usuarioInicial.telefono ?? "",
        password: "", // no viene desde el back (WRITE_ONLY)
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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

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

    // En creación SIEMPRE mandamos password.
    // En edición, solo si escribes algo.
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

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
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