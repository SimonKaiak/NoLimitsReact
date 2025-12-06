import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearClasificacion from "../../components/organisms/CrearClasificacion";
import {
  listarClasificaciones,
  eliminarClasificacion,
  obtenerClasificacion,
} from "../../services/clasificaciones";
import "../../styles/adminBase.css";

/**
 * Componente AdminClasificacionList
 *
 * Esta pantalla permite:
 * - Ver todas las clasificaciones registradas.
 * - Buscar clasificaciones por su nombre.
 * - Crear nuevas clasificaciones.
 * - Editar clasificaciones existentes.
 * - Eliminar clasificaciones.
 *
 * También maneja un pequeño sistema de paginación.
 */
export default function AdminClasificacionList() {
  
  // Lista de clasificaciones mostradas en la tabla
  const [clasificaciones, setClasificaciones] = useState([]);

  // Texto que el usuario escribe en el cuadro de búsqueda
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtro real que se aplica cuando el usuario presiona "Buscar"
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Página actual y total de páginas (por ahora siempre es 1)
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estado que indica si se están cargando datos
  const [loading, setLoading] = useState(false);

  // Contiene datos para abrir el modal de Crear/Editar
  const [modalData, setModalData] = useState(null);

  /**
   * useEffect que carga las clasificaciones
   * cada vez que cambia la página o el filtro aplicado.
   */
  useEffect(() => {
    cargarClasificaciones(filtroBusqueda);
  }, [pagina, filtroBusqueda]);

  /**
   * Función que llama al backend para obtener las clasificaciones.
   * Si hay resultados los guarda en el estado.
   */
  async function cargarClasificaciones(filtro = "") {
    setLoading(true);
    try {
      const data = await listarClasificaciones(pagina, filtro);

      /**
       * Dependiendo del formato del backend,
       * puede llegar un arreglo directo o puede venir un objeto.
       */
      setClasificaciones(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);


    } catch (err) {
      console.error(err);
      alert("Error al cargar clasificaciones");
    }
    setLoading(false);
  }

  /**
   * Función que se ejecuta cuando el usuario presiona el botón "Buscar".
   * Solo aquí se aplica realmente el texto del cuadro de búsqueda.
   */
  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  /**
   * Función que elimina una clasificación por su id.
   * Primero pide confirmación al usuario.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar clasificación?")) return;

    try {
      await eliminarClasificacion(id);

      // Se elimina visualmente de la tabla sin recargar toda la página
      setClasificaciones((prev) => prev.filter((c) => c.id !== id));

      alert("Clasificación eliminada");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  /**
   * Función que abre el modal de edición.
   * Antes de abrirlo, obtiene del backend los datos completos del registro.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const clasif = await obtenerClasificacion(fila.id);

      setModalData({
        modo: "editar",
        clasificacion: clasif,
      });
    } catch (err) {
      console.error(err);
      alert("Error al obtener clasificación");
    }
  };

  // Render principal del componente
  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Clasificaciones</h1>

      {/* Cuadro de búsqueda */}
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

      {/* Botón para crear un registro */}
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

      {/* Modal de Crear/Editar */}
      {modalData && (
        <CrearClasificacion
          modo={modalData.modo}
          clasificacion={modalData.clasificacion}
          onCerrar={() => {
            setModalData(null);
            cargarClasificaciones(filtroBusqueda);
          }}
        />
      )}

      {/* Tabla de resultados */}
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