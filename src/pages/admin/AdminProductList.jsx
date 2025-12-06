import React, { useState, useEffect } from "react";
import {
  obtenerProducto,
  eliminarProducto,
  listarProductosPaginado,
} from "../../services/productos";
import CrearProducto from "../../components/organisms/CrearProducto";
import "../../styles/adminProductos.css";

/**
 * AdminProductList
 *
 * Componente de administración para la entidad Producto.
 * Permite:
 *  - Buscar un producto por ID
 *  - Mostrar datos del producto encontrado
 *  - Editar un producto (usa CrearProducto en modo "editar")
 *  - Eliminar un producto
 *  - Crear nuevos productos desde un formulario persistente
 *  - Ver un listado paginado de productos
 *
 *  Esta pantalla combina:
 *  - Búsqueda puntual por ID
 *  - Tabla paginada para tener una vista general
 */
export default function AdminProductList() {
  // ID ingresado por el usuario en el buscador
  const [busquedaId, setBusquedaId] = useState("");

  // Resultado del producto encontrado por ID (ProductoResponseDTO)
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  // Mensaje de error en caso de que el ID no exista
  const [error, setError] = useState("");

  // Producto seleccionado para edición
  const [productoEditando, setProductoEditando] = useState(null);

  // Listado paginado
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      // Opcional: recargar página actual del listado
      cargarPagina(page);
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
    // Opcional: recargar listado paginado
    cargarPagina(page);
  }

  /**
   * Cargar una página del listado paginado.
   */
  async function cargarPagina(pagina) {
    try {
      const data = await listarProductosPaginado(pagina, 5); // 5 productos por página

      // Tu back usa PagedResponse<T> con:
      //  - contenido
      //  - pagina
      //  - totalPaginas
      //  - totalElementos
      const lista =
        Array.isArray(data.contenido)
          ? data.contenido
          : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];

      setProductos(lista);
      setTotalPages(data.totalPaginas || data.totalPages || 1);
    } catch (err) {
      console.error("Error al listar productos paginados:", err);
      setProductos([]);
      setTotalPages(1);
    }
  }

  /**
   * Efecto: recargar cada vez que cambie la página actual.
   */
  useEffect(() => {
    cargarPagina(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
          <button type="submit" className="btn-nl">
            Buscar
          </button>
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
                  <th>Clasificación</th>
                  <th>Estado</th>
                  <th>Saga</th>
                  <th>Portada saga</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{resultadoBusqueda.id}</td>
                  <td>{resultadoBusqueda.nombre}</td>
                  <td>${resultadoBusqueda.precio}</td>
                  {/* Estos nombres vienen del ProductoResponseDTO nuevo */}
                  <td>{resultadoBusqueda.tipoProductoNombre}</td>
                  <td>{resultadoBusqueda.clasificacionNombre || "-"}</td>
                  <td>{resultadoBusqueda.estadoNombre}</td>
                  <td>{resultadoBusqueda.saga || "-"}</td>
                  <td>{resultadoBusqueda.portadaSaga || "-"}</td>
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

      {/* ------------------------ LISTADO PAGINADO ------------------------ */}
      <div className="admin-products-card">
        <h2 className="admin-products-title">Listado de Productos</h2>

        {/* Tabla */}
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Saga</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay productos registrados
                </td>
              </tr>
            )}

            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>{prod.tipoProductoNombre}</td>
                <td>{prod.estadoNombre}</td>
                <td>{prod.saga || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="paginacion">
          <button
            className="btn-nl"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Anterior
          </button>

          <span>
            Página {page} de {totalPages}
          </span>

          <button
            className="btn-nl"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* ------------------------ TARJETA: CREAR NUEVO PRODUCTO ------------------------ */}
      <div className="admin-products-card">
        <CrearProducto
          modo="crear"
          onFinish={() => {
            if (busquedaId) buscarPorId(busquedaId);
            cargarPagina(page);
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