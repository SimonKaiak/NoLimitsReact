// Ruta: src/pages/admin/AdminTipoProductoList.jsx

/**
 * Módulo de administración para gestionar los Tipos de Producto.
 *
 * Funcionalidades:
 *  - Listar tipos de producto desde el backend
 *  - Buscar por nombre (el backend ya soporta filtrado)
 *  - Crear un tipo nuevo
 *  - Editar un tipo existente
 *  - Eliminar un tipo de producto
 *
 * Notas del comportamiento:
 *  - La búsqueda NO se ejecuta automáticamente al escribir.
 *    Solo se aplica al presionar "Buscar".
 *  - La paginación actualmente es estática (1 página), pero el código
 *    queda adaptado para cuando el backend implemente paginación real.
 */

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearTipoProducto from "../../components/organisms/CrearTipoProducto.jsx";

import {
  listarTiposProducto,
  eliminarTipoProducto,
  obtenerTipoProducto,
} from "../../services/tiposProducto.js";

import "../../styles/adminBase.css";

export default function AdminTipoProductoList() {
  /** Lista de tipos mostrados en la tabla */
  const [tipos, setTipos] = useState([]);

  /** Texto escrito por el usuario para buscar */
  const [busqueda, setBusqueda] = useState("");

  /** Página actual (backend futuro) */
  const [pagina, setPagina] = useState(1);

  /** Total de páginas (fijo por ahora) */
  const [totalPaginas, setTotalPaginas] = useState(1);

  /** Estado de carga */
  const [loading, setLoading] = useState(false);

  /** Datos para el modal (crear/editar) */
  const [modalData, setModalData] = useState(null);

  /**
   * Efecto principal:
   * - Se ejecuta cuando cambia la página.
   * - La búsqueda por nombre solo se activa cuando presionas "Buscar".
   */
  useEffect(() => {
    cargarTipos();
  }, [pagina]);

  /**
   * Carga los tipos desde el backend aplicando el filtro.
   * Soporta respuesta tanto como array directo como `{ contenido: [...] }`.
   */
  async function cargarTipos() {
    setLoading(true);
    try {
      const data = await listarTiposProducto(pagina, busqueda);

      setTipos(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar tipos de producto");
    }
    setLoading(false)
  }

  /**
   * Eliminar un tipo de producto por ID.
   * Solicita confirmación antes de eliminar.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de producto?")) return;

    try {
      await eliminarTipoProducto(id);

      // Eliminamos solo en el estado local
      setTipos((prev) => prev.filter((t) => t.id !== id));

      alert("Tipo de producto eliminado");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar!");
    }
  };

  /**
   * Obtiene un tipo de producto por ID y abre el modal en modo edición.
   */
  const abrirModalEditar = async (tipoTabla) => {
    try {
      const tipoCompleto = await obtenerTipoProducto(tipoTabla.id);

      setModalData({
        modo: "editar",
        tipo: tipoCompleto,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener datos del tipo de producto");
    }
  };

  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Tipos de Producto</h1>

      {/* ----------------------------- */}
      {/* BUSCADOR                     */}
      {/* ----------------------------- */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1); // siempre vuelve a página 1 al escribir
          }}
          className="admin-input"
        />

        {/* El botón fuerza la búsqueda con el texto actual */}
        <ButtonAction text="Buscar" onClick={cargarTipos} />
      </div>

      {/* ----------------------------- */}
      {/* CREAR TIPO                   */}
      {/* ----------------------------- */}
      <div className="admin-crear">
        <ButtonAction
          text="Crear Tipo de Producto"
          onClick={() =>
            setModalData({
              modo: "crear",
              tipo: null,
            })
          }
        />
      </div>

      {/* ----------------------------- */}
      {/* MODAL CREAR / EDITAR         */}
      {/* ----------------------------- */}
      {modalData && (
        <CrearTipoProducto
          modo={modalData.modo}
          tipo={modalData.tipo}
          onCerrar={() => {
            setModalData(null);
            cargarTipos();
          }}
        />
      )}

      {/* ----------------------------- */}
      {/* TABLA PRINCIPAL              */}
      {/* ----------------------------- */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="admin-msg">Cargando...</td>
            </tr>
          ) : tipos.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-msg">No hay resultados</td>
            </tr>
          ) : (
            tipos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombre}</td>
                <td>{t.activo ? "Sí" : "No"}</td>

                <td className="admin-actions">
                  <ButtonAction
                    text="Editar"
                    onClick={() => abrirModalEditar(t)}
                  />
                  <ButtonAction
                    text="Eliminar"
                    onClick={() => handleEliminar(t.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ----------------------------- */}
      {/* PAGINACIÓN (placeholder)     */}
      {/* ----------------------------- */}
      <div className="admin-pagination">

        <ButtonAction
          text="Anterior"
          disabled={pagina <= 1}
          onClick={() => setPagina((prev) => prev - 1)}
        />

        <span className="admin-page-info">
          Página {pagina} / {totalPaginas}
        </span>

        <ButtonAction
          text="Siguiente"
          disabled={pagina >= totalPaginas}
          onClick={() => setPagina((prev) => prev + 1)}
        />
      </div>

    </div>
  );
}