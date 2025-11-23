import React, { useState } from "react";
import {
    crearMetodoPago,
    editarMetodoPago
} from "../../services/metodosPago";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearMetodoPago({ modo, metodo, onCerrar }) {

    const [form, setForm] = useState({
        nombre: metodo?.nombre || "",
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

        if (form.nombre.trim().length > 50) {
            err.nombre = "Máximo 50 caracteres";
            ok = false;
        }

        // ACTIVO (boolean obligatorio)
        if (form.activo === null || form.activo === undefined) {
            err.activo = "El campo activo es obligatorio";
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
                await crearMetodoPago(payload);
                alert("Método de pago creado con éxito!");
            } else {
                await editarMetodoPago(metodo.id, payload);
                alert("Método de pago editado correctamente!");
            }

            onCerrar();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-bg">
            <div className="modal-content">
                
                <h2>{modo === "crear" ? "Crear Método de Pago" : "Editar Método de Pago"}</h2>

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
                    {errores.activo && <p className="error-msg">{errores.activo}</p>}

                    <div className="modal-buttons">
                        <ButtonAction text="Guardar" type="submit" />
                        <ButtonAction text="Cancelar" onClick={onCerrar} />
                    </div>

                </form>
            </div>
        </div>
    );
}
