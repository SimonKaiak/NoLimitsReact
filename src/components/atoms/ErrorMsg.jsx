import React from "react";

// Este muestra un mensaje de error en formularios.

/**
 * Componente de mensaje de error.
 * 
 * @param {string} message - Texto del mensaje de error que se mostrará. 
 * 
 * Si el mensaje está vacío o es null, no se mostrará pero el componente se mantiene
 * para conservar la estructura del layout (forma en que los elementos se organizan y distribuyen dentro de la página).
 */
export const ErrorMsg = ({ message }) => {
    return (
        <span 
        id="errorMsg"           // Identificador único
        className="error-msg"   // Clase para aplicar estilos de css
        role="alert"            // Indica a los lectores de pantalla que es un mensaje de alerta 
        aria-live="polite"      // Anuncia el cambio del texto de manera no intrusiva
        >     
            {message}           {/* Muestra el texto del error si existe */}
        </span>
    );
};