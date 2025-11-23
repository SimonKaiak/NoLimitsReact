import React from "react";

/**
 * Banner de éxito para mostrar como notificación 
 * @param {string} message - Texto del mensaje a mostrar.
 * @param {boolean} visible - Si el banner debe mostrarse o no.
 */

export const MensajeConfirmacion = () => {
    return (
        <div 
        className="mensaje-confirmacion">
            <h2>¡Compra realizada con éxito!</h2>
            <p>Gracias por tu preferencia! Te enviaremos un correo con los detalles de tu compra.</p>
        </div>
    );
};