// Ruta: src/pages/EditarPerfil.jsx
/**
 * Componente: EditarPerfil
 * ---------------------------------------------
 * Modal diseñado para actualizar los datos del usuario:
 *  - Nombre
 *  - Apellidos
 *  - Correo (validación fuerte)
 *  - Teléfono (solo números)
 *  - Password (opcional, write-only)
 *
 * El componente:
 *  - Carga los datos iniciales desde props.usuario
 *  - Valida cada campo
 *  - Envía los cambios al backend mediante actualizarMiPerfil()
 *  - Notifica a PerfilUsuario para que recargue sus datos
 *  - Cierra el modal al finalizar
 *
 * Props:
 *  - usuario: objeto con los datos actuales del usuario
 *  - onCerrar: función para cerrar el modal
 *  - onActualizado: función para refrescar los datos en el padre
 */

import React, { useState } from "react";
import InputText from "../components/atoms/InputText";
import { ButtonAction } from "../components/atoms/ButtonAction";
import { actualizarMiPerfil } from "../services/usuarios";

export default function EditarPerfil({ usuario, onCerrar, onActualizado }) {

    // ================================
    //  ESTADO DEL FORMULARIO
    // ================================
    const [form, setForm] = useState({
        nombre: usuario?.nombre || "",
        apellidos: usuario?.apellidos || "",
        correo: usuario?.correo || "",
        telefono: usuario?.telefono || "",
        password: ""   // Write-only: nunca precargamos password
    });

    // Estado de errores por campo
    const [errores, setErrores] = useState({});

    // ================================
    //  HANDLE CHANGE
    // ================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        // Limpia error individual
        setErrores((prev) => ({ ...prev, [name]: "" }));
    };

    // ================================
    //  VALIDACIÓN DE CAMPOS
    // ================================
    const validar = () => {
        const err = {};
        let ok = true;

        // Nombre
        if (!form.nombre.trim()) {
            err.nombre = "El nombre no puede estar en blanco";
            ok = false;
        }

        // Apellidos
        if (!form.apellidos.trim()) {
            err.apellidos = "Los apellidos no pueden estar en blanco";
            ok = false;
        }

        // Correo
        if (!form.correo.trim()) {
            err.correo = "El correo es obligatorio";
            ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
            err.correo = "Formato de correo inválido";
            ok = false;
        }

        // Teléfono (opcional pero validado)
        if (form.telefono && !/^\d+$/.test(form.telefono)) {
            err.telefono = "El teléfono debe contener solo números";
            ok = false;
        }

        setErrores(err);
        return ok;
    };

    // ================================
    //  SUBMIT FORMULARIO
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        // Construimos payload limpio
        const payload = {
            nombre: form.nombre.trim(),
            apellidos: form.apellidos.trim(),
            correo: form.correo.trim(),
            telefono: form.telefono.trim(),
            ...(form.password ? { password: form.password } : {}) // solo si fue escrita
        };

        try {
            await actualizarMiPerfil(usuario.id, payload);

            alert("Perfil actualizado correctamente");

            onActualizado(); // refrescar datos del usuario (perfil)
            onCerrar();      // cerrar modal

        } catch (err) {
            alert("❌ Error al actualizar perfil");
            console.error(err);
        }
    };

    return (
        <div className="modal-bg-perfil">
            <div className="modal-content">

                <h2>Editar Perfil</h2>

                <form onSubmit={handleSubmit}>

                    {/* Nombre */}
                    <InputText 
                        label="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                    />

                    {/* Apellidos */}
                    <InputText 
                        label="Apellidos"
                        name="apellidos"
                        value={form.apellidos}
                        onChange={handleChange}
                        error={errores.apellidos}
                    />

                    {/* Correo */}
                    <InputText 
                        label="Correo"
                        name="correo"
                        type="email"
                        value={form.correo}
                        onChange={handleChange}
                        error={errores.correo}
                    />

                    {/* Teléfono */}
                    <InputText 
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        error={errores.telefono}
                    />

                    {/* Contraseña */}
                    <InputText 
                        label="Contraseña (opcional)"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errores.password}
                    />

                    {/* Botones */}
                    <div className="modal-buttons">
                        <ButtonAction text="Guardar" type="submit" />
                        <ButtonAction text="Cancelar" onClick={onCerrar} />
                    </div>
                </form>

            </div>
        </div>
    );
}
