// Ruta: src/pages/admin/AdminEmpresaList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearEmpresa from "../../components/organisms/CrearEmpresa";

import {
  listarEmpresas,
  eliminarEmpresa,
  obtenerEmpresa,
} from "../../services/empresas";

export default function AdminEmpresaList() {
  const [empresas, setEmpresas] = useState([]);

  // texto que escribe el usuario
  const [busquedaInput, setBusquedaInput] = useState("");
  // filtro real aplicado al cargar
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarEmpresas(filtroBusqueda);
  }, [pagina, filtroBusqueda]);

  async function cargarEmpresas(filtro = "") {
    setLoading(true);
    try {
      const data = await listarEmpresas(pagina, filtro);
      setEmpresas(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1); // por ahora fijo, el back no pagina
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar empresas");
    }
    setLoading(false);
  }

  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput); // aquí recién aplicas la búsqueda
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar empresa?")) return;
    try {
      await eliminarEmpresa(id);
      setEmpresas((prev) => prev.filter((e) => e.id !== id));
      alert("Empresa eliminada!");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar");
    }
  };

  const abrirModalEditar = async (row) => {
    try {
      const empresa = await obtenerEmpresa(row.id);
      setModalData({ modo: "editar", empresa });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener empresa");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Empresas</h1>

      {/* Buscador */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busquedaInput}
          onChange={(e) => setBusquedaInput(e.target.value)}
          className="admin-input"
        />
        <ButtonAction text="Buscar" onClick={handleBuscarClick} />
      </div>

      {/* Crear */}
      <div className="admin-form">
        <ButtonAction
          text="Crear Empresa"
          onClick={() => setModalData({ modo: "crear", empresa: null })}
        />
      </div>

      {/* Modal */}
      {modalData && (
        <CrearEmpresa
          modo={modalData.modo}
          empresa={modalData.empresa}
          onCerrar={() => {
            setModalData(null);
            cargarEmpresas(filtroBusqueda);
          }}
        />
      )}

      {/* Tabla */}
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
          ) : empresas.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            empresas.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.nombre}</td>
                <td>{e.activo ? "Sí" : "No"}</td>
                <td className="admin-actions">
                  <ButtonAction
                    text="Editar"
                    onClick={() => abrirModalEditar(e)}
                  />
                  <ButtonAction
                    text="Eliminar"
                    onClick={() => handleEliminar(e.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación placeholder */}
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
    </div>
  );
}