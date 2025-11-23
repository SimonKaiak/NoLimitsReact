import React, { useState } from "react";
import { ForgotPasswordForm } from "../molecules/ForgotPasswordForm";
import avatarImg from "../../assets/img/logos/candado.webp";

/**
 * Este s el componente principal de la sección "Olvidé mi contraseña"
 * 
 * Este componente muestra una imagen (que es un candado) con una animación
 * y el formulario donde el usuario puede ingresar su correo electrónico
 * para recuperar su contraseña.
 */

export const ForgotPasswordSection = () => {

    // Estado local que indica si la imagen está en proceso de voltearse
    const [isFlipping, setIsFlipping] = useState(false);

    /**
     * Función que se ejecuta al hacer click en la imagen del candado.
     * 
     * Si ya está girando (isFlippings = true), no hace nada.
     * Si no está girando, activa la ainmación cambiando el estado a true.
     */
    const handleAvatarClick = () => {
        if (isFlipping) return; // Evita activar la animación si ya está corriendo
        setIsFlipping(true) // Inicia la animación del giro
    };

    /**
     * Función que se ejecuta cuando termina la animación del candado.
     * 
     * Restaura el estado a false para permitir que el usuario pueda volver 
     * a activar la animación con otro click
     */

    const handleAnimationEnd = () => {
        setIsFlipping(false);
    };

    /**
     * Renderizado del componente
     * 
     * Muestra una sección que contiene
     * - Un encabezado con la imagen del candado (que se puede animar al hacerle click)
     * - El formulario de recuperación de contraseña.
     */

    return (
        <section className="section-forgot-password">
            <header>
                <div
                // Se agregan clases dinámicamente para aplicar la animación CSS si isFlipping = true
                className={`image-container ${isFlipping ? 'backflip' : ''}`}

                // Evento que indica la animación al hacer click en la imagen
                onClick={handleAvatarClick}

                // Evento que detecta cuando termina la animación y resetea el estado
                onAnimationEnd={handleAnimationEnd}
                >
                    <div className="image">
                        {/* Imagen del candado!*/}
                        <img 
                        src={avatarImg}
                        className="avatar"
                        alt="candado contraseña"
                        />
                    </div>
                </div>
            </header>

            {/* Contenedor del formulario de recuperación*/}
            <div className="formulario-container"> 
                <ForgotPasswordForm />
            </div>
            
        </section>
    );
};