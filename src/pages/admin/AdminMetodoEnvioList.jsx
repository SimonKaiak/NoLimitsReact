// Ruta: src/pages/admin/AdminMetodoEnvioList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearMetodoEnvio from "../../components/organisms/CrearMetodoEnvio";
import {
  listarMetodosEnvio,
  eliminarMetodoEnvio,
  obtenerMetodoEnvio,
} from "../../services/metodosEnvio";

export default function AdminMetodoEnvioList() {
  const [metodos, setMetodos] = useState([]);
  const [busqueda, setBusqueda] = useState("");      // filtro real
  const [busquedaTemp, setBusquedaTemp] = useState(""); // lo que escribes
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarMetodos();
  }, [pagina, busqueda]);

  async function cargarMetodos() {
    setLoading(true);
    try {
      const data = await listarMetodosEnvio(pagina, busqueda);
      setMetodos(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar métodos de envío");
    }
    setLoading(false);
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar método de envío?")) return;
    try {
      await eliminarMetodoEnvio(id);
      await cargarMetodos(); // recarga desde backend
      alert("Método eliminado!");
    } catch (err) {
      alert("❌ Error al eliminar método de envío");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const metodo = await obtenerMetodoEnvio(fila.id);
      setModalData({
        modo: "editar",
        metodo,
      });
    } catch (err) {
      alert("❌ Error al obtener método de envío");
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Métodos de Envío</h1>

      {/* Buscador */}
      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busquedaTemp}
          onChange={(e) => setBusquedaTemp(e.target.value)}
          className="admin-input"
        />
        <ButtonAction
          text="Buscar"
          onClick={() => {
            setBusqueda(busquedaTemp); // aquí recién se aplica el filtro
            setPagina(1);
          }}
        />
      </div>

      {/* Crear */}
      <div className="admin-form">
        <ButtonAction
          text="Crear Método de Envío"
          onClick={() => setModalData({ modo: "crear", metodo: null })}
        />
      </div>

      {/* Modal */}
      {modalData && (
        <CrearMetodoEnvio
          modo={modalData.modo}
          metodo={modalData.metodo}
          onCerrar={() => {
            setModalData(null);
            cargarMetodos();
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
          ) : metodos.length === 0 ? (
            <tr>
              <td colSpan="4" className="admin-msg">
                No hay resultados
              </td>
            </tr>
          ) : (
            metodos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre}</td>
                <td>{m.activo ? "Sí" : "No"}</td>
                <td className="admin-actions">
                  <ButtonAction
                    text="Editar"
                    onClick={() => abrirModalEditar(m)}
                  />
                  <ButtonAction
                    text="Eliminar"
                    onClick={() => handleEliminar(m.id)}
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