import React, { useState } from "react";
import {
    crearDesarrollador,
    editarDesarrollador
} from "../../services/desarrolladores";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearDesarrollador({ modo, desarrollador, onCerrar }) {

    const [form, setForm] = useState({
        nombre: desarrollador?.nombre || "",
        activo: desarrollador?.activo ?? true
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

        if (form.nombre.trim().length > 120) {
            err.nombre = "Máximo 120 caracteres";
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
            activo: !!form.activo
        };

        try {
            if (modo === "crear") {
                await crearDesarrollador(payload);
                alert("Desarrollador creado con éxito!");
            } else {
                await editarDesarrollador(desarrollador.id, payload);
                alert("Desarrollador editado correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">
                <h2>{modo === "crear" ? "Crear Desarrollador" : "Editar Desarrollador"}</h2>

                <form onSubmit={handleSubmit}>

                    <InputText
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                    />

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
