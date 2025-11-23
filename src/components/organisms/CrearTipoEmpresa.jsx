import React, { useState } from "react";
import { ButtonAction } from "../atoms/ButtonAction.jsx";
import {
  crearTipoEmpresa,
  actualizarTipoEmpresa,
} from "../../services/tiposEmpresa.js";

export default function CrearTipoEmpresa({ modo, tipo, onCerrar }) {
  const [nombre, setNombre] = useState(tipo?.nombre || "");
  const esEditar = modo === "editar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nombre: nombre.trim() };

    if (!payload.nombre) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      if (esEditar && tipo?.id) {
        await actualizarTipoEmpresa(tipo.id, payload);
        alert("Tipo de empresa actualizado");
      } else {
        await crearTipoEmpresa(payload);
        alert("Tipo de empresa creado");
      }
      onCerrar();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el tipo de empresa");
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2 className="admin-title">
          {esEditar ? "Editar Tipo de Empresa" : "Crear Tipo de Empresa"}
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-label">
            Nombre
            <input
              type="text"
              className="admin-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Publisher"
            />
          </label>

          <div className="admin-actions">
            <ButtonAction type="submit" text={esEditar ? "Guardar cambios" : "Crear"} />
            <ButtonAction type="button" text="Cancelar" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}