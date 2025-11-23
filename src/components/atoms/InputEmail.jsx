import React from "react";

// Campo de entrada controlado para el correo electrónico
// dentro de formularios de autenticación.
// Permite mostrar errores de validación dinámicamente.

/**
 * Componente de entrada para correos electrónicos.
 * 
 * @param {string} value - Valor actual del campo de correo.
 * @param {function} onChange - Función que se ejecuta al cambiar el valor del input.
 * @param {boolean} hasError - Indica si el campo contiene un error de validación.
 */

export const InputEmail = ({ value, onChange, hasError }) => {
    return (
        <input
        id = "email"                        // Identificador único del input
        type = "email"                      // Define el tipo de dato como correo electrónico
        placeholder = "Ingresa tu correo"   // Texto mostrado cuando el campo está vacío
        required                            // Hace que el campo sea obligatorio en el formulario
        value = {value}                     // Valor controlado proveniente del estado del componente padre
        onChange = {onChange}               // Actualiza el valor al escribir
        className = {hasError ? "input-error" : ""} // Aplica una clase css si existe un error
        />
    );
};