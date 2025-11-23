import React from "react";

/**
 * Componente reutilizable de botón de envío.
 * 
 * @param {string} text - Texto que se mostrará dentro del botón.
 * 
 * Este componente permite mantener un diseño y comportamiento
 * consistentes en todos los formularios de la aplicación.
 */

export const ButtonSubmit = ({ text, onClick, className = "" }) => {
    return (
        <button onClick={onClick} className={className}>{text}</button>
    );
};