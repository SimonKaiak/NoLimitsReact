// Ruta: src/components/organisms/CrearTipoDesarrollador.jsx
import React, { useState } from "react";
import { ButtonAction } from "../atoms/ButtonAction.jsx";
import {
  crearTipoDesarrollador,
  actualizarTipoDesarrollador,
} from "../../services/tiposDesarrollador.js";

export default function CrearTipoDesarrollador({ modo, tipo, onCerrar }) {
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
        await actualizarTipoDesarrollador(tipo.id, payload);
        alert("Tipo de desarrollador actualizado");
      } else {
        await crearTipoDesarrollador(payload);
        alert("Tipo de desarrollador creado");
      }
      onCerrar();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el tipo de desarrollador");
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2 className="admin-title">
          {esEditar ? "Editar Tipo de Desarrollador" : "Crear Tipo de Desarrollador"}
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-label">
            Nombre
            <input
              type="text"
              className="admin-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Estudio, Publisher, Freelancer..."
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