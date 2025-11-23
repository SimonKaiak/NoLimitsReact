// Ruta: src/pages/admin/AdminPlataformaList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearPlataforma from "../../components/organisms/CrearPlataforma";
import {
  listarPlataformas,
  eliminarPlataforma,
  obtenerPlataforma,
} from "../../services/plataformas";

export default function AdminPlataformaList() {
  const [plataformas, setPlataformas] = useState([]);

  // lo que escribe el usuario
  const [busquedaInput, setBusquedaInput] = useState("");
  // filtro real aplicado
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarPlataformas(filtroBusqueda);
  }, [pagina, filtroBusqueda]);

  // CARGAR LISTADO
  async function cargarPlataformas(filtro = "") {
    setLoading(true);

    try {
      const data = await listarPlataformas(pagina, filtro);
      setPlataformas(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1); // el back no pagina
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar plataformas");
    }

    setLoading(false);
  }

  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput); // aquí recién aplicas la búsqueda
  };

  // ELIMINAR
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta plataforma?")) return;

    try {
      await eliminarPlataforma(id);
      setPlataformas((prev) => prev.filter((p) => p.id !== id));
      alert("Plataforma eliminada!");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar");
    }
  };

  // EDITAR (OBTENER POR ID)
  const abrirModalEditar = async (fila) => {
    try {
      const plat = await obtenerPlataforma(fila.id);
      setModalData({
        modo: "editar",
        plataforma: plat,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener plataforma");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Plataformas</h1>

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
          text="Crear Plataforma"
          onClick={() =>
            setModalData({
              modo: "crear",
              plataforma: null,
            })
          }
        />
      </div>

      {/* Modal */}
      {modalData && (
        <CrearPlataforma
          modo={modalData.modo}
          plataforma={modalData.plataforma}
          onCerrar={() => {
            setModalData(null);
            cargarPlataformas(filtroBusqueda);
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
          ) : plataformas.length === 0 ? (
            <tr>
              <td colSpan="3" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            plataformas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td className="admin-actions">
                  <ButtonAction text="Editar" onClick={() => abrirModalEditar(p)} />
                  <ButtonAction text="Eliminar" onClick={() => handleEliminar(p.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginacion */}
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