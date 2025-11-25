// Ruta: src/pages/admin/AdminProductList.jsx

import React, { useState } from "react";
import {
  obtenerProducto,
  eliminarProducto,
} from "../../services/productos";
import CrearProducto from "../../components/organisms/CrearProducto";
import "../../styles/adminProductos.css";

/**
 * AdminProductList
 *
 * Componente de administración para la entidad Producto.
 * Permite:
 *  Buscar un producto por ID
 *  Mostrar datos del producto encontrado
 *  Editar un producto (usa CrearProducto en modo "editar")
 *  Eliminar un producto
 *  Crear nuevos productos desde un formulario persistente
 *
 *  Esta pantalla funciona distinta a las otras,
 *       pues no lista todos los productos sino que trabaja por ID.
 */
export default function AdminProductList() {
  // ID ingresado por el usuario en el buscador
  const [busquedaId, setBusquedaId] = useState("");

  // Resultado del producto encontrado por ID
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  // Mensaje de error en caso de que el ID no exista
  const [error, setError] = useState("");

  // Producto seleccionado para edición
  const [productoEditando, setProductoEditando] = useState(null);

  /**
   * Buscar un producto por ID.
   * Limpia estados previos y muestra mensajes claros según el resultado.
   */
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

  /**
   * Acción del formulario de búsqueda.
   */
  async function handleBuscarPorId(e) {
    e.preventDefault();
    await buscarPorId(busquedaId);
  }

  /**
   * Eliminar producto por ID.
   * Tras eliminar, limpia resultados visibles.
   */
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

  /**
   * Se ejecuta cuando termina de editar un producto.
   * Recarga los datos del producto si se estaba buscando uno.
   */
  function handleFinEdicion() {
    setProductoEditando(null);
    if (busquedaId) {
      buscarPorId(busquedaId);
    }
  }

  /**
   * Render principal del módulo de productos.
   */
  return (
    <div className="admin-products-page">

      {/* ------------------------ TARJETA: BUSCAR POR ID ------------------------ */}
      <div className="admin-products-card">
        <h2 className="admin-products-title">Productos</h2>

        {/* Formulario de búsqueda por ID */}
        <form className="admin-products-search" onSubmit={handleBuscarPorId}>
          <input
            type="number"
            className="admin-products-input"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            placeholder="Buscar producto por ID"
          />
          <button type="submit" className="btn-nl">Buscar</button>
        </form>

        {/* Mostrar error si el ID no existe */}
        {error && <p className="admin-products-error">{error}</p>}

        {/* ------------------------ RESULTADO DE LA BÚSQUEDA ------------------------ */}
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

      {/* ------------------------ TARJETA: CREAR NUEVO PRODUCTO ------------------------ */}
      <div className="admin-products-card">
        <CrearProducto
          modo="crear"
          onFinish={() => {
            if (busquedaId) buscarPorId(busquedaId);
          }}
        />
      </div>

      {/* ------------------------ TARJETA: EDITAR PRODUCTO ------------------------ */}
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
