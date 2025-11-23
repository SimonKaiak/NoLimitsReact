import React, { useState } from "react";
import { crearEstado, editarEstado } from "../../services/estados";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearEstado({ modo, estado, onCerrar }) {

    const [form, setForm] = useState({
        nombre: estado?.nombre || "",
        descripcion: estado?.descripcion || "",
        activo: estado?.activo ?? true
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrores((prev) => ({ ...prev, [name]: "" }));
    };

    const validar = () => {
        const err = {};
        let ok = true;

        if (!form.nombre || form.nombre.trim().length === 0) {
            err.nombre = "El nombre no puede estar en blanco";
            ok = false;
        }

        if (form.nombre.trim().length > 50) {
            err.nombre = "Máximo 50 caracteres";
            ok = false;
        }

        if (form.descripcion && form.descripcion.length > 255) {
            err.descripcion = "Máximo 255 caracteres";
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
            descripcion: form.descripcion?.trim() || null,
            activo: !!form.activo
        };

        try {
            if (modo === "crear") {
                await crearEstado(payload);
                alert("Estado creado con éxito!");
            } else {
                await editarEstado(estado.id, payload);
                alert("Estado editado correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">

                <h2>{modo === "crear" ? "Crear Estado" : "Editar Estado"}</h2>

                <form onSubmit={handleSubmit}>

                    <InputText
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                    />

                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                    />
                    {errores.descripcion && (
                        <p className="error-msg">{errores.descripcion}</p>
                    )}

                    <label>
                        <input
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                        Activo
                    </label>

                    <div className="modal-buttons">
                        <ButtonAction text="Guardar" type="submit" />
                        <ButtonAction text="Cancelar" onClick={onCerrar} />
                    </div>

                </form>
            </div>
        </div>
    );
}
