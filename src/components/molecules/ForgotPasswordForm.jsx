// Ruta: src/components/molecules/ForgotPasswordForm.jsx

import React, { useState } from "react";
import { InputEmail } from "../atoms/InputEmail";
import { ErrorMsg } from "../atoms/ErrorMsg";
import { ButtonSubmit } from "../atoms/ButtonSubmit";
import { useNavigate } from "react-router-dom";
import { verificarCorreoRegistrado } from "../../services/usuarios";

/**
 * Componente ForgotPasswordForm
 * 
 * Este componente muestra un formulario que permite al usuario ingresar
 * su correo electrónico para recibir instrucciones de recuperación de contraseña.
 * 
 * Este contiene validaciones de formato de correo y verificación de existencia del usuario
 * consultando directamente al backend.
 */

export const ForgotPasswordForm = () => {

    // Para DOM Enrutamiento.
    const navigate = useNavigate();

    // Estado que almacena el valor actual del campo de correo electrónico
    const [email, setEmail] = useState("");

    // Estado que guarda el mensaje de error en caso de validación incorrecta
    const [errorMsg, setErrorMsg] = useState("");

    // Estado para controlar carga mientras se valida en backend
    const [loading, setLoading] = useState(false);

    /**
     * Manejador del evento "submit" del formulario.
     * Se encarga de validar el correo ingresado y verificar si pertenece a un usuario registrado.
     * 
     * @param {Event} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página)

        // Expresión regular básica para validar el formato de correo electrónico.
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Primera validación: campo vacío.
        if (!email) {
            setErrorMsg("Ingrese un correo electrónico.");
            return;
        }

        // Segunda validación: formato incorrecto.
        if (!isEmail) {
            setErrorMsg("Formato de correo inválido.");
            return;
        }

        setErrorMsg("");
        setLoading(true);

        try {
            // Tercera validación: existencia del usuario en la base de datos (backend).
            await verificarCorreoRegistrado(email);

            // Simula el envío del correo de recuperación.
            alert(`Enviamos un enlace de recuperación a: ${email}`);

            // Después de 1.5 segundos, redirige a la página de login.
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            if (err.message === "NOT_FOUND") {
                setErrorMsg("El correo no está asociado a ninguna cuenta registrada.");
            } else {
                setErrorMsg("Ocurrió un error al validar el correo. Inténtalo más tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Manejador para el evento onChange del campo de correo.
     * Actualiza el estado "email" cada vez que el usuario escribe.
     * Si había un mensaje de error previo, lo limpia automáticamente.
     */
    const handleChange = (e) => {
        setEmail(e.target.value);
        if (errorMsg) setErrorMsg(""); // Limpia el error al escribir nuevamente.
    };

    /**
     * Renderizado del formulario.
     * Esto incluye:
     * - Un texto explicativo.
     * - Campo para ingresar correo.
     * - Mensaje de error en caso de validación incorrecta.
     * - Botón de envío para continuar.
     */

    return (
       <form id="formOlvide" onSubmit={handleSubmit} noValidate>
        {/* Texto informativo para el usuario */}
        <strong>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para una nueva contraseña. <br />
            Una vez hecho, se te dirigirá a la página principal.
        </strong>

        <footer>
            {/* Campo de correo electrónico con su mensaje de error */}
            <div className="field">
                <InputEmail 
                    value={email} 
                    onChange={handleChange} 
                    hasError={!!errorMsg} 
                />
                <ErrorMsg message={errorMsg}/>
            </div>

            {/* Botón para enviar el formulario */}
            <ButtonSubmit 
                text={loading ? "Verificando..." : "Continuar"} 
                className="nl-forgot-btn"
                disabled={loading}
            />
        </footer>
       </form> 
    );
};