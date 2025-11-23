import React, { useState } from "react";
import { crearMetodoEnvio, editarMetodoEnvio } from "../../services/metodosEnvio";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearMetodoEnvio({ modo, metodo, onCerrar }) {

    const [form, setForm] = useState({
        nombre: metodo?.nombre || "",
        descripcion: metodo?.descripcion || "",
        activo: metodo?.activo ?? true
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

        // NOMBRE
        if (!form.nombre || form.nombre.trim().length === 0) {
            err.nombre = "El nombre no puede estar en blanco";
            ok = false;
        }

        if (form.nombre.trim().length > 80) {
            err.nombre = "Máximo 80 caracteres";
            ok = false;
        }

        // DESCRIPCION
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
                await crearMetodoEnvio(payload);
                alert("Método de envío creado con éxito!");
            } else {
                await editarMetodoEnvio(metodo.id, payload);
                alert("Método de envío editado correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">

                <h2>{modo === "crear" ? "Crear Método de Envío" : "Editar Método de Envío"}</h2>

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
