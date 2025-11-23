// Ruta: src/pages/admin/AdminProductList.jsx

import React, { useState } from "react";
import {
  obtenerProducto,
  eliminarProducto,
} from "../../services/productos";
import CrearProducto from "../../components/organisms/CrearProducto";
import "../../styles/adminProductos.css";

export default function AdminProductList() {
  const [busquedaId, setBusquedaId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [error, setError] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);

  async function buscarPorId(id) {
    if (!id) return;
    setError("");
    setResultadoBusqueda(null);
    setProductoEditando(null);

    try {
      const prod = await obtenerProducto(id);
      setResultadoBusqueda(prod);
    } catch (e) {
      console.error(e);
      setError("No se encontró el producto: " + e.message);
    }
  }

  async function handleBuscarPorId(e) {
    e.preventDefault();
    await buscarPorId(busquedaId);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      setResultadoBusqueda(null);
      setProductoEditando(null);
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }

  function handleFinEdicion() {
    setProductoEditando(null);
    if (busquedaId) {
      buscarPorId(busquedaId);
    }
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-card">
        <h2 className="admin-products-title">Productos</h2>

        {/* Buscar por ID */}
        <form
          className="admin-products-search"
          onSubmit={handleBuscarPorId}
        >
          <input
            type="number"
            className="admin-products-input"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            placeholder="Buscar producto por ID"
          />
          <button type="submit" className="btn-nl">
            Buscar
          </button>
        </form>

        {error && <p className="admin-products-error">{error}</p>}

        {/* Resultado de la búsqueda */}
        {resultadoBusqueda && (
          <div className="admin-products-result">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{resultadoBusqueda.id}</td>
                  <td>{resultadoBusqueda.nombre}</td>
                  <td>${resultadoBusqueda.precio}</td>
                  <td>{resultadoBusqueda.tipoProducto?.nombre}</td>
                  <td>{resultadoBusqueda.estado?.nombre}</td>
                  <td className="admin-products-actions">
                    <button
                      type="button"
                      className="btn-nl btn-nl-secondary"
                      onClick={() => setProductoEditando(resultadoBusqueda)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-nl btn-nl-danger"
                      onClick={() => handleEliminar(resultadoBusqueda.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Crear producto */}
      <div className="admin-products-card">
        <CrearProducto
          modo="crear"
          onFinish={() => {
            if (busquedaId) buscarPorId(busquedaId);
          }}
        />
      </div>

      {/* Editar producto */}
      {productoEditando && (
        <div className="admin-products-card">
          <CrearProducto
            modo="editar"
            productoInicial={productoEditando}
            onFinish={handleFinEdicion}
          />
          <button
            type="button"
            className="btn-nl btn-nl-secondary admin-products-cancel"
            onClick={() => setProductoEditando(null)}
          >
            Cancelar edición
          </button>
        </div>
      )}
    </div>
  );
}