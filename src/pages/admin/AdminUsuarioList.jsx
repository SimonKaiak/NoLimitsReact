import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction";
import CrearUsuario from "../../components/organisms/CrearUsuario";
import DetalleUsuario from "../../components/organisms/DetalleUsuario";
import {
  listarUsuarios,
  eliminarUsuario,
  obtenerUsuario,
} from "../../services/usuarios";
import "../../styles/adminBase.css";

export default function AdminUsuarioList() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");        // filtro aplicado
  const [busquedaTemp, setBusquedaTemp] = useState(""); // lo que escribe el usuario
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalEditar, setModalEditar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, [pagina, busqueda]);

  async function cargarUsuarios() {
    setLoading(true);
    try {
      const data = await listarUsuarios(pagina, busqueda);
      setUsuarios(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error cargando usuarios");
    }
    setLoading(false);
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;

    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado");
    } catch (err) {
      alert("❌ No se puede eliminar (ventas asociadas)");
    }
  };

    const abrirEditar = async (fila) => {
        const usuario = await obtenerUsuario(fila.id);
        setModalEditar(usuario);
    };

    const abrirDetalle = async (fila) => {
        const usuario = await obtenerUsuario(fila.id);
        setModalDetalle(usuario);
    };

    // LOADER
    if (loading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Cargando usuarios...</p>
        </div>
        );
    }

    return (
        <div className="admin-wrapper">
        <h1 className="admin-title">Gestionar Usuarios</h1>

        {/* Buscador */}
        <div className="admin-form">
            <input
            type="text"
            className="admin-input"
            placeholder="Buscar por nombre o correo..."
            value={busquedaTemp}
            onChange={(e) => setBusquedaTemp(e.target.value)}
            />
            <ButtonAction
            text="Buscar"
            onClick={() => {
                setBusqueda(busquedaTemp); // aplica filtro (nombre o correo)
                setPagina(1);
            }}
            />
        </div>

        {/* Mensaje cuando no hay resultados */}
        {usuarios.length === 0 && (
            <p className="admin-empty">
            {busqueda
                ? `No se encontraron usuarios para "${busqueda}".`
                : "No hay usuarios registrados."}
            </p>
        )}

        {/* Tabla */}
        <table className="admin-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Comuna / Región</th>
                <th>Ventas</th>
                <th>Acciones</th>
            </tr>
            </thead>

            <tbody>
            {usuarios.map((u) => (
                <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombreCompleto}</td>
                <td>{u.correo}</td>
                <td>{u.rol?.nombre}</td>
                <td>
                    {u.comuna?.nombre} - {u.region?.nombre}
                </td>
                <td>{u.ventasAsociadas?.length ?? 0}</td>
                <td className="admin-actions">
                    <ButtonAction text="Ver" onClick={() => abrirDetalle(u)} />
                    <ButtonAction text="Editar" onClick={() => abrirEditar(u)} />
                    <ButtonAction
                    text="Eliminar"
                    onClick={() => handleEliminar(u.id)}
                    />
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Paginación */}
        <div className="admin-pagination">
            <ButtonAction
            text="Anterior"
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
            />

            <span className="admin-page-info">
            Página {pagina} / {totalPaginas}
            </span>

            <ButtonAction
            text="Siguiente"
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina((p) => p + 1)}
            />
        </div>

        {/* MODAL EDITAR */}
        {modalEditar && (
        <CrearUsuario
            modo="editar"
            usuario={modalEditar}
            onCerrar={() => {
            setModalEditar(null);
            cargarUsuarios();
            }}
        />
        )}


        {/* MODAL DETALLE */}
        {modalDetalle && (
            <DetalleUsuario
            usuario={modalDetalle}
            onCerrar={() => setModalDetalle(null)}
            />
        )}
        </div>
    );
}