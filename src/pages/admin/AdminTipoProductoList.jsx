// Ruta: src/pages/admin/AdminTipoProductoList.jsx
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
  const [tipos, setTipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal Crear / Editar
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarTipos();
    // ahora sólo depende de la página:
    // escribir en el input NO dispara la búsqueda
  }, [pagina]);

  // CARGAR LISTADO (con filtro por nombre en el front)
  async function cargarTipos() {
    setLoading(true);

    try {
      const data = await listarTiposProducto(pagina, busqueda);
      // si el back alguna vez devuelve {contenido:[...]} esto lo soporta igual
      setTipos(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1); // fijo por ahora, como en los otros catálogos
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar tipos de producto");
    }

    setLoading(false);
  }

  // ELIMINAR
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de producto?")) return;

    try {
      await eliminarTipoProducto(id);
      setTipos((prev) => prev.filter((t) => t.id !== id));
      alert("Tipo de producto eliminado");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar!");
    }
  };

  // EDITAR (OBTENER POR ID)
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

      {/* Buscador */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
          }}
          className="admin-input"
        />

        {/* Ahora el botón fuerza la búsqueda con el texto actual */}
        <ButtonAction text="Buscar" onClick={cargarTipos} />
      </div>

      {/* Crear Tipo */}
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

      {/* Modal */}
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

      {/* TABLA */}
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
              <td colSpan="4" className="admin-msg">
                Cargando...
              </td>
            </tr>
          ) : tipos.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            tipos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombre}</td>
                <td>{t.activo ? "Sí" : "No"}</td>

                <td className="admin-actions">
                  <ButtonAction text="Editar" onClick={() => abrirModalEditar(t)} />
                  <ButtonAction text="Eliminar" onClick={() => handleEliminar(t.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINACION */}
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