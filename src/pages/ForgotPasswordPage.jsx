import React from "react";
import { ForgotPasswordSection } from "../components/organisms/ForgotPasswordSection";
import "../styles/olvideMiContrasenia.css";
import Footer from "../components/organisms/Footer.jsx";
import Navbar from "../components/organisms/Navbar.jsx";

export const ForgotPasswordPage = () => {
    return (
        <div className="nl-full-page-layout no-dark-overlay">
            <Navbar /> {/* Agrega la barra superior */}
            
            {/* El contenido principal (la caja del formulario) */}
            <ForgotPasswordSection />

            <Footer /> {/* Agrega la barra inferior */}
        </div>
    );
};