// Ruta: src/components/organisms/CrearUsuario.jsx

import React, { useState } from "react";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";
import {
  crearUsuario,
  editarUsuario,
  ROL_ADMIN_ID,
  ROL_CLIENTE_ID,
} from "../../services/usuarios";

export default function CrearUsuario({ modo = "crear", usuario, onCerrar }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    password: "",
    // guardamos el id del rol en el form (como string)
    rol: usuario?.rol?.id ? String(usuario.rol.id) : "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const err = {};
    let ok = true;

    if (!form.nombre.trim()) {
      err.nombre = "El nombre es obligatorio";
      ok = false;
    }

    if (!form.apellidos.trim()) {
      err.apellidos = "Los apellidos son obligatorios";
      ok = false;
    }

    if (!form.correo.includes("@")) {
      err.correo = "Correo inválido";
      ok = false;
    }

    if (!/^[0-9]*$/.test(form.telefono)) {
      err.telefono = "Solo se permiten dígitos";
      ok = false;
    }

    if (modo === "crear" && form.password.trim().length < 6) {
      err.password = "El password debe tener mínimo 6 caracteres";
      ok = false;
    }

    if (!form.rol) {
      err.rol = "Selecciona un rol";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono.trim(),
      // Usamos los IDs constantes para evitar confusiones:
      // ROL_ADMIN_ID = 1, ROL_CLIENTE_ID = 2
      rol: { id: Number(form.rol) },
    };

    if (modo === "crear") {
      payload.password = form.password;
    }

    try {
      if (modo === "crear") {
        await crearUsuario(payload);
        alert("Usuario creado con éxito!");
      } else {
        await editarUsuario(usuario.id, payload);
        alert("Usuario editado correctamente!");
      }

      onCerrar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Usuario" : "Editar Usuario"}</h2>

        <form onSubmit={handleSubmit}>
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          <InputText
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            error={errores.apellidos}
          />

          <InputText
            label="Correo"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            error={errores.correo}
          />

          <InputText
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            error={errores.telefono}
          />

          {modo === "crear" && (
            <InputText
              label="Password (no se muestra nunca)"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errores.password}
            />
          )}

          <label>Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="">Seleccione...</option>
            {/* CLIENTE = ROL_CLIENTE_ID, ADMIN = ROL_ADMIN_ID */}
            <option value={String(ROL_CLIENTE_ID)}>CLIENTE</option>
            <option value={String(ROL_ADMIN_ID)}>ADMIN</option>
          </select>
          {errores.rol && <p className="error-msg">{errores.rol}</p>}

          <div className="modal-buttons">
            <ButtonAction type="submit" text="Guardar" />
            <ButtonAction text="Cancelar" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}