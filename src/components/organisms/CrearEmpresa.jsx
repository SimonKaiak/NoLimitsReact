import React, { useState } from "react";
import { crearEmpresa, editarEmpresa } from "../../services/empresas";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearEmpresa({ modo, empresa, onCerrar }) {

    const [form, setForm] = useState({
        nombre: empresa?.nombre || "",
        activo: empresa?.activo ?? true
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        setErrores(prev => ({ ...prev, [name]: "" }));
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
                await crearEmpresa(payload);
                alert("Empresa creada con éxito!");
            } else {
                await editarEmpresa(empresa.id, payload);
                alert("Empresa editada correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">

                <h2>{modo === "crear" ? "Crear Empresa" : "Editar Empresa"}</h2>

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
