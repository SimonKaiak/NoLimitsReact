// Ruta: src/pages/admin/AdminTipoEmpresaList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearTipoEmpresa from "../../components/organisms/CrearTipoEmpresa.jsx";
import {
  listarTiposEmpresa,
  eliminarTipoEmpresa,
  obtenerTipoEmpresa,
} from "../../services/tiposEmpresa.js";
import "../../styles/adminBase.css";

export default function AdminTipoEmpresaList() {
  const [tipos, setTipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");   // lo que escribes
  const [filtro, setFiltro] = useState("");       // lo que realmente se aplica
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState(null);

  // carga inicial + cuando cambian página o filtro aplicado
  useEffect(() => {
    cargarTipos();
  }, [pagina, filtro]);

  async function cargarTipos() {
    setLoading(true);
    try {
      const data = await listarTiposEmpresa(pagina, filtro);

      // tu backend devuelve paginado, así que respetamos eso
      setTipos(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar tipos de empresa");
    }
    setLoading(false);
  }

  const handleClickBuscar = () => {
    setPagina(1);        // vuelves a la primera página
    setFiltro(busqueda); // aplicas el texto actual del input
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de empresa?")) return;

    try {
      await eliminarTipoEmpresa(id);
      setTipos((prev) => prev.filter((t) => t.id !== id));
      alert("Tipo de empresa eliminado");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar el tipo de empresa");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const tipo = await obtenerTipoEmpresa(fila.id);
      setModalData({
        modo: "editar",
        tipo,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener tipo de empresa");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Tipos de Empresa</h1>

      {/* Buscador */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="admin-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClickBuscar(); // buscar también con Enter
          }}
        />
        <ButtonAction text="Buscar" onClick={handleClickBuscar} />
      </div>

      {/* Crear */}
      <div className="admin-form">
        <ButtonAction
          text="Crear Tipo de Empresa"
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
        <CrearTipoEmpresa
          modo={modalData.modo}
          tipo={modalData.tipo}
          onCerrar={() => {
            setModalData(null);
            cargarTipos();
          }}
        />
      )}

      {/* Tabla */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="admin-msg">
                Cargando...
              </td>
            </tr>
          ) : tipos.length === 0 ? (
            <tr>
              <td colSpan="3" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            tipos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombre}</td>
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

      {/* Paginación */}
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