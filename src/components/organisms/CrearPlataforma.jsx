import React, { useState } from "react";
import { crearPlataforma, editarPlataforma } from "../../services/plataformas";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearPlataforma({ modo, plataforma, onCerrar }) {

    const [form, setForm] = useState({
        nombre: plataforma?.nombre || ""
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
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
                await crearPlataforma(payload);
                alert("Plataforma creada!");
            } else {
                await editarPlataforma(plataforma.id, payload);
                alert("Plataforma editada!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">
                <h2>{modo === "crear" ? "Crear Plataforma" : "Editar Plataforma"}</h2>

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
