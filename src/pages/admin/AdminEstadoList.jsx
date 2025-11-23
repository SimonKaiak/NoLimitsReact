// Ruta: src/pages/admin/AdminEstadoList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearEstado from "../../components/organisms/CrearEstado";
import { listarEstados, eliminarEstado, obtenerEstado } from "../../services/estados";

export default function AdminEstadoList() {

  const [estados, setEstados] = useState([]);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    cargarEstados(filtroBusqueda);
  }, [pagina, filtroBusqueda]);

  async function cargarEstados(filtro = "") {
    setLoading(true);
    try {
      const data = await listarEstados(pagina, filtro);
      setEstados(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(1);
    } catch (err) {
      alert("❌ Error al cargar estados");
    }
    setLoading(false);
  }

  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar estado?")) return;

    try {
      await eliminarEstado(id);
      setEstados((prev) => prev.filter((e) => e.id !== id));
      alert("Estado eliminado!");
    } catch (err) {
      alert("❌ Error al eliminar");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const est = await obtenerEstado(fila.id);
      setModalData({
        modo: "editar",
        estado: est
      });
    } catch {
      alert("❌ Error al obtener estado");
    }
  };

  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Estados</h1>

      {/* BUSCADOR */}
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

      <div className="admin-form">
        <ButtonAction
          text="Crear Estado"
          onClick={() => setModalData({ modo: "crear", estado: null })}
        />
      </div>

      {modalData && (
        <CrearEstado
          modo={modalData.modo}
          estado={modalData.estado}
          onCerrar={() => {
            setModalData(null);
            cargarEstados(filtroBusqueda);
          }}
        />
      )}

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
            <tr><td colSpan="4" className="admin-msg">Cargando...</td></tr>
          ) : estados.length === 0 ? (
            <tr><td colSpan="4" className="admin-msg">No hay resultados</td></tr>
          ) : (
            estados.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.nombre}</td>
                <td>{e.activo ? "Sí" : "No"}</td>
                <td className="admin-actions">
                  <ButtonAction text="Editar" onClick={() => abrirModalEditar(e)} />
                  <ButtonAction text="Eliminar" onClick={() => handleEliminar(e.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}