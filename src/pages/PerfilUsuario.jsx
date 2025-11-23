import React, { useEffect, useState } from "react";
import { ButtonAction } from "../components/atoms/ButtonAction";
import "../styles/perfil.css"
import { useNavigate } from "react-router-dom";
// Modals
import EditarPerfil from "./EditarPerfil";
import MisCompras from "./MisCompras";

// Servicios
import { obtenerMiPerfil } from "../services/usuarios";

export default function PerfilUsuario() {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalCompras, setModalCompras] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarUsuario();
    }, []);

    async function cargarUsuario() {
        setLoading(true);

        try {
            const data = await obtenerMiPerfil();
            setUsuario(data);

        } catch (err) {
            console.error(err);
            alert("❌ Error al cargar datos del usuario");
        }

        setLoading(false);
    }

    if (loading) {
        return <p className="cargando">Cargando perfil...</p>;
    }

    if (!usuario) {
        return <p className="error-msg">No se pudo cargar la información del usuario.</p>;
    }

    return (
        <div className="perfil-container">
            <h1 className="perfil-titulo">Mi Perfil</h1>

            {/* ================= DATOS BÁSICOS ================= */}
            <div className="perfil-info">

                <h2>Información Personal</h2>

                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Apellidos:</strong> {usuario.apellidos}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>

                <p><strong>Rol:</strong> {usuario.rol?.nombre || "Usuario"}</p>

                {/* =============== DIRECCIÓN (solo lectura) =============== */}
                <h3>Dirección</h3>
                {usuario.direccion ? (
                    <>
                        <p><strong>Calle:</strong> {usuario.direccion.calle}</p>
                        <p><strong>Comuna:</strong> {usuario.direccion.comuna?.nombre}</p>
                        <p><strong>Región:</strong> {usuario.direccion.region?.nombre}</p>
                    </>
                ) : (
                    <p>No hay dirección registrada.</p>
                )}
            </div>

            {/* ================= BOTONES ================= */}
            <div className="perfil-botones">
                <ButtonAction
                    text="Editar Perfil"
                    onClick={() => setModalEditar(true)}
                />

                <ButtonAction
                    text="Mis Compras"
                    onClick={() => navigate("/mis-compras")}
                />
            </div>

            {/* ================= MODAL EDITAR PERFIL ================= */}
            {modalEditar && (
                <EditarPerfil
                    usuario={usuario}
                    onCerrar={() => {
                        setModalEditar(false);
                        cargarUsuario(); // refrescar datos
                    }}
                />
            )}

            {/* ================= MODAL MIS COMPRAS ================= */}
            {modalCompras && (
                <MisCompras
                    usuarioId={usuario.id}
                    onCerrar={() => setModalCompras(false)}
                />
            )}
        </div>
    );
}
