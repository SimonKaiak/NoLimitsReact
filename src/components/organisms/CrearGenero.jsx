import React, { useState } from "react";
import { crearGenero, editarGenero } from "../../services/generos";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearGenero({ modo, genero, onCerrar }) {

    const [form, setForm] = useState({
        nombre: genero?.nombre || ""
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        setForm({ nombre: e.target.value });
        setErrores({});
    };

    const validar = () => {
        const err = {};
        let ok = true;

        if (!form.nombre || form.nombre.trim().length === 0) {
            err.nombre = "El nombre no puede estar en blanco";
            ok = false;
        }

        if (form.nombre.trim().length > 80) {
            err.nombre = "Máximo 80 caracteres";
            ok = false;
        }

        setErrores(err);
        return ok;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        const payload = {
            nombre: form.nombre.trim()
        };

        try {
            if (modo === "crear") {
                await crearGenero(payload);
                alert("Género creado con éxito!");
            } else {
                await editarGenero(genero.id, payload);
                alert("Género editado correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">

                <h2>{modo === "crear" ? "Crear Género" : "Editar Género"}</h2>

                <form onSubmit={handleSubmit}>

                    <InputText
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                    />

                    <div className="modal-buttons">
                        <ButtonAction text="Guardar" type="submit" />
                        <ButtonAction text="Cancelar" onClick={onCerrar} />
                    </div>

                </form>
            </div>
        </div>
    );
}
