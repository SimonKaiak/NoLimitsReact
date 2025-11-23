import React from "react";
import "../../styles/buttonAction.css"

/**
 * Componente de botón para acciones con estilo personalizado.
 * 
 * @param {string} label - Texto que se mostrará en el botón.
 * @param {function} onClick - Función que se ejecutará al hacer click.
 * @param {string} [variant = "succes"] - Tipo de botón 
 * 
 * Este botón se utiliza para acciones como "descargar", "enviar" o "volver". 
 */

export const ButtonAction = ({ text, onClick, variant, className, disabled }) => {
    return (
        <button
        className={className}
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        variant={variant}
        >
            {text}
        </button>
    );
};