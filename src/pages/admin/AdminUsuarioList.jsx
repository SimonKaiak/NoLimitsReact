// Ruta: src/pages/admin/AdminUsuarioList.jsx

import React, { useState } from "react";
import {
  obtenerUsuario,
  eliminarUsuario,
  obtenerMisCompras,
} from "../../services/usuarios";
import CrearUsuario from "../../components/organisms/CrearUsuario";
import "../../styles/adminBase.css";

export default function AdminUsuarioList() {
  const [busquedaId, setBusquedaId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [error, setError] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState("");

  async function doBuscarPorId(id) {
    if (!id) return;
    setError("");
    setResultadoBusqueda(null);
    setUsuarioEditando(null);

    // Limpia compras al cambiar de usuario buscado
    setCompras([]);
    setErrorCompras("");
    setLoadingCompras(false);

    try {
      const u = await obtenerUsuario(id);
      setResultadoBusqueda(u);
    } catch (e) {
      console.error(e);
      setError("No se encontró el usuario: " + e.message);
    }
  }

  async function handleBuscarPorId(e) {
    e.preventDefault();
    await doBuscarPorId(busquedaId);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setResultadoBusqueda(null);
      setUsuarioEditando(null);
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }

  async function handleVerCompras(usuarioId) {
    setLoadingCompras(true);
    setErrorCompras("");
    setCompras([]);

    try {
      const data = await obtenerMisCompras(usuarioId);
      setCompras(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErrorCompras("Error al cargar las compras: " + e.message);
    } finally {
      setLoadingCompras(false);
    }
  }

  function handleFinEdicion() {
    setUsuarioEditando(null);
    if (busquedaId) {
      doBuscarPorId(busquedaId);
    }
  }

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Administrar usuarios</h2>

      {/* Buscar por ID */}
      <form className="admin-form" onSubmit={handleBuscarPorId}>
        <input
          type="number"
          className="admin-input"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          placeholder="Buscar usuario por ID"
        />
        <button type="submit" className="admin-btn">
          Buscar
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
      )}

      {/* Resultado de la búsqueda */}
      {resultadoBusqueda && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{resultadoBusqueda.id}</td>
              <td>
                {resultadoBusqueda.nombre} {resultadoBusqueda.apellidos}
              </td>
              <td>{resultadoBusqueda.correo}</td>
              <td>{resultadoBusqueda.telefono}</td>
              <td>{resultadoBusqueda.rol?.nombre}</td>
              <td>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-action-btn admin-action-edit"
                    onClick={() => setUsuarioEditando(resultadoBusqueda)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn admin-action-delete"
                    onClick={() => handleEliminar(resultadoBusqueda.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn admin-btn"
                    onClick={() => handleVerCompras(resultadoBusqueda.id)}
                  >
                    Ver compras
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* ================= COMPRAS DEL USUARIO ================= */}

      {loadingCompras && <p className="admin-msg">Cargando compras...</p>}

      {errorCompras && <p style={{ color: "red" }}>{errorCompras}</p>}

      {!loadingCompras && compras.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <h3 className="admin-title" style={{ fontSize: "20px" }}>
            Compras realizadas
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Total</th>
                <th>Método de pago</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((venta) => (
                <tr key={venta.id ?? venta.idVenta}>
                  <td>{venta.id ?? venta.idVenta}</td>
                  <td>{venta.fechaCompra}</td>
                  <td>{venta.horaCompra}</td>
                  <td>${venta.totalVenta}</td>
                  <td>
                    {venta.metodoPagoModel?.nombre ||
                      venta.metodoPago?.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loadingCompras &&
        compras.length === 0 &&
        resultadoBusqueda &&
        !errorCompras && (
          <p className="admin-msg">Este usuario no registra compras.</p>
        )}

      {/* Editar usuario (solo cuando se pulsa Editar) */}
      {usuarioEditando && (
        <div style={{ marginTop: "25px" }}>
          <h3
            className="admin-title"
            style={{ fontSize: "22px", marginBottom: "15px" }}
          >
            Editar usuario
          </h3>
          <CrearUsuario
            modo="editar"
            usuarioInicial={usuarioEditando}
            onFinish={handleFinEdicion}
          />
          <button
            type="button"
            className="admin-btn-secondary"
            style={{ marginTop: "10px" }}
            onClick={() => setUsuarioEditando(null)}
          >
            Cancelar edición
          </button>
        </div>
      )}
    </div>
  );
}