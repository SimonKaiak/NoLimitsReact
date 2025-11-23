// Ruta: src/pages/admin/AdminGeneroList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearGenero from "../../components/organisms/CrearGenero";
import {
  listarGeneros,
  eliminarGenero,
  obtenerGenero,
} from "../../services/generos";

export default function AdminGeneroList() {
  const [generos, setGeneros] = useState([]);

  // Lo que el usuario escribe
  const [busquedaInput, setBusquedaInput] = useState("");
  // Filtro real que se usa para llamar al backend
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarGeneros(filtroBusqueda);
  }, [pagina, filtroBusqueda]);

  async function cargarGeneros(filtro = "") {
    setLoading(true);
    try {
      const data = await listarGeneros(pagina, filtro);
      setGeneros(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1); // por ahora fijo
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar géneros");
    }
    setLoading(false);
  }

  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput); // aquí recién aplicas la búsqueda
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar género?")) return;

    try {
      await eliminarGenero(id);
      setGeneros((prev) => prev.filter((g) => g.id !== id));
      alert("Género eliminado!");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const gen = await obtenerGenero(fila.id);
      setModalData({
        modo: "editar",
        genero: gen,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener género");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Géneros</h1>

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
          text="Crear Género"
          onClick={() =>
            setModalData({
              modo: "crear",
              genero: null,
            })
          }
        />
      </div>

      {/* Modal */}
      {modalData && (
        <CrearGenero
          modo={modalData.modo}
          genero={modalData.genero}
          onCerrar={() => {
            setModalData(null);
            cargarGeneros(filtroBusqueda);
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
          ) : generos.length === 0 ? (
            <tr>
              <td colSpan="3" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            generos.map((g) => (
              <tr key={g.id}>
                <td>{g.id}</td>
                <td>{g.nombre}</td>
                <td className="admin-actions">
                  <ButtonAction text="Editar" onClick={() => abrirModalEditar(g)} />
                  <ButtonAction text="Eliminar" onClick={() => handleEliminar(g.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación (placeholder) */}
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