import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearClasificacion from "../../components/organisms/CrearClasificacion";
import {
  listarClasificaciones,
  eliminarClasificacion,
  obtenerClasificacion,
} from "../../services/clasificaciones";
import "../../styles/adminBase.css";

export default function AdminClasificacionList() {
  const [clasificaciones, setClasificaciones] = useState([]);

  // 🔹 Lo que el usuario escribe en el input
  const [busquedaInput, setBusquedaInput] = useState("");

  // 🔹 Filtro REAL que se usa para buscar (solo cambia al presionar el botón)
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarClasificaciones(filtroBusqueda);
  }, [pagina, filtroBusqueda]); // 👈 ya NO depende de lo que escribes, solo del filtro aplicado

  async function cargarClasificaciones(filtro = "") {
    setLoading(true);
    try {
      const data = await listarClasificaciones(pagina, filtro);
      setClasificaciones(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1); // por ahora 1 porque el back no está paginando
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar clasificaciones");
    }
    setLoading(false);
  }

  const handleBuscarClick = () => {
    // cuando presionas el botón recién aplicas el filtro
    setPagina(1); // opcional: siempre vuelves a la página 1
    setFiltroBusqueda(busquedaInput);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar clasificación?")) return;

    try {
      await eliminarClasificacion(id);
      setClasificaciones((prev) => prev.filter((c) => c.id !== id));
      alert("Clasificación eliminada!");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const clasif = await obtenerClasificacion(fila.id);
      setModalData({
        modo: "editar",
        clasificacion: clasif,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener clasificación");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Clasificaciones</h1>

      {/* Buscador */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busquedaInput}
          onChange={(e) => {
            setBusquedaInput(e.target.value); // 👈 solo actualiza el texto, no dispara búsqueda
          }}
          className="admin-input"
        />
        <ButtonAction text="Buscar" onClick={handleBuscarClick} />
      </div>

      {/* Crear */}
      <div className="admin-form">
        <ButtonAction
          text="Crear Clasificación"
          onClick={() =>
            setModalData({
              modo: "crear",
              clasificacion: null,
            })
          }
        />
      </div>

      {/* Modal */}
      {modalData && (
        <CrearClasificacion
          modo={modalData.modo}
          clasificacion={modalData.clasificacion}
          onCerrar={() => {
            setModalData(null);
            cargarClasificaciones(filtroBusqueda); // recarga respetando el filtro actual
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
          ) : clasificaciones.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            clasificaciones.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.activo ? "Sí" : "No"}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-action-btn admin-action-edit"
                      onClick={() => abrirModalEditar(c)}
                    >
                      Editar
                    </button>

                    <button
                      className="admin-action-btn admin-action-delete"
                      onClick={() => handleEliminar(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
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