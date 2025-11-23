// Ruta: src/components/organisms/CrearProducto.jsx

import React, { useState, useEffect } from "react";
import InputText from "../atoms/InputText";
import InputNumber from "../atoms/InputNumber";
import SelectBase from "../atoms/SelectBase";
import { ButtonAction } from "../atoms/ButtonAction";

import {
  crearProducto,
  editarProducto,
  fetchTiposProducto,
  fetchClasificaciones,
  fetchEstados,
  fetchGeneros,
  fetchPlataformas,
  fetchEmpresas,
  fetchDesarrolladores,
  actualizarCatalogo,
  obtenerImagenes,
  subirImagen,
  eliminarImagen,
} from "../../services/productos";

export default function CrearProducto({ modo = "crear", producto = null, onCerrar }) {
  const [tab, setTab] = useState("datos"); // datos | catalogo

  // ------------------ FORM PRINCIPAL ------------------
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    precio: producto?.precio ?? "",
    tipoProducto: producto?.tipoProducto?.id || "",
    clasificacion: producto?.clasificacion?.id || "",
    estado: producto?.estado?.id || "",
  });

  const [errores, setErrores] = useState({});
  const [tipos, setTipos] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [estados, setEstados] = useState([]);

  // ------------------ CATÁLOGO ------------------
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [desarrolladores, setDesarrolladores] = useState([]);

  const [catData, setCatData] = useState({
    generos: [],
    plataformas: [],
    empresas: [],
    desarrolladores: [],
    imagenes: [],
  });

  // ------------------ CARGA INICIAL ------------------
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Selects simples
        const [tiposRes, clasifRes, estadosRes] = await Promise.all([
          fetchTiposProducto(),
          fetchClasificaciones(),
          fetchEstados(),
        ]);

        setTipos(tiposRes || []);
        setClasificaciones(clasifRes || []);
        setEstados(estadosRes || []);

        // Catálogo
        const [genRes, platRes, empRes, devRes] = await Promise.all([
          fetchGeneros(),
          fetchPlataformas(),
          fetchEmpresas(),
          fetchDesarrolladores(),
        ]);

        setGeneros(genRes || []);
        setPlataformas(platRes || []);
        setEmpresas(empRes || []);
        setDesarrolladores(devRes || []);

        // Si estás editando: cargar relaciones actuales
        if (modo === "editar" && producto) {
          const rel = {
            generos: (producto.generos || []).map((g) => g.id),
            plataformas: (producto.plataformas || []).map((p) => p.id),
            empresas: (producto.empresas || []).map((e) => e.id),
            desarrolladores: (producto.desarrolladores || []).map((d) => d.id),
            imagenes: await obtenerImagenes(producto.id),
          };
          setCatData(rel);
        }
      } catch (err) {
        console.error("Error cargando selects/catalogo:", err);
      }
    }

    cargarDatos();
  }, [modo, producto]);

  // ------------------ HANDLERS ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const err = {};
    let ok = true;

    const nombre = formData.nombre?.trim() || "";

    if (!nombre || nombre.length < 2) {
      err.nombre = "Nombre obligatorio (mínimo 2 caracteres)";
      ok = false;
    } else if (nombre.length > 100) {
      err.nombre = "El nombre no puede superar los 100 caracteres";
      ok = false;
    }

    const precioNum = Number(formData.precio);
    if (!formData.precio || Number.isNaN(precioNum) || precioNum <= 0) {
      err.precio = "Precio obligatorio y mayor a 0";
      ok = false;
    }

    if (!formData.tipoProducto) {
      err.tipoProducto = "Selecciona un tipo de producto";
      ok = false;
    }

    if (!formData.estado) {
      err.estado = "Selecciona un estado";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      nombre: formData.nombre.trim(),
      precio: Number(formData.precio),
      // Coincide con el @Schema del modelo: solo ID en objetos anidados
      tipoProducto: { id: Number(formData.tipoProducto) },
      clasificacion: formData.clasificacion
        ? { id: Number(formData.clasificacion) }
        : null,
      estado: { id: Number(formData.estado) },
    };

    try {
      if (modo === "crear") {
        await crearProducto(payload);
        alert("Producto creado con éxito");
        onCerrar();
      } else {
        await editarProducto(producto.id, payload);
        alert("Producto editado con éxito");
        setTab("catalogo");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error guardando producto");
    }
  };

  // Multi-select catálogo
  const toggleMulti = (lista, itemId) => {
    setCatData((prev) => {
      const existe = prev[lista].includes(itemId);
      return {
        ...prev,
        [lista]: existe
          ? prev[lista].filter((id) => id !== itemId)
          : [...prev[lista], itemId],
      };
    });
  };

  const handleImagen = async (e) => {
    const file = e.target.files[0];
    if (!file || !producto) return;
    try {
      const subida = await subirImagen(producto.id, file);
      setCatData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, subida],
      }));
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir imagen");
    }
  };

  const borrarImagen = async (idImagen) => {
    if (!producto) return;
    try {
      await eliminarImagen(producto.id, idImagen);
      setCatData((prev) => ({
        ...prev,
        imagenes: prev.imagenes.filter((img) => img.id !== idImagen),
      }));
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar imagen");
    }
  };

  const guardarCatalogo = async () => {
    if (!producto) return;
    try {
      await actualizarCatalogo(producto.id, catData);
      alert("Catálogo actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar el catálogo");
    }
  };

  // ------------------ OPCIONES SELECT ------------------
  const opcionesTipos = (tipos || []).map((t) => ({
    value: t.id,
    label: t.nombre,
  }));

  const opcionesClasif = (clasificaciones || []).map((c) => ({
    value: c.id,
    label: c.nombre,
  }));

  const opcionesEstados = (estados || []).map((e) => ({
    value: e.id,
    label: e.nombre,
  }));

  // ------------------ RENDER ------------------
  return (
    <div className="crear-producto-container">
      <div className="tabs">
        <button
          className={tab === "datos" ? "tab-activo" : ""}
          onClick={() => setTab("datos")}
        >
          Datos del Producto
        </button>
        <button
          className={tab === "catalogo" ? "tab-activo" : ""}
          onClick={() => setTab("catalogo")}
          disabled={modo === "crear"}
        >
          Catálogo
        </button>
      </div>

      {tab === "datos" && (
        <form onSubmit={handleSubmit}>
          <InputText
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          <InputNumber
            label="Precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            error={errores.precio}
            min={1}
          />

          <SelectBase
            label="Tipo de Producto"
            name="tipoProducto"
            value={formData.tipoProducto}
            onChange={handleChange}
            options={opcionesTipos}
            error={errores.tipoProducto}
          />

          <SelectBase
            label="Clasificación"
            name="clasificacion"
            value={formData.clasificacion}
            onChange={handleChange}
            options={opcionesClasif}
          />

          <SelectBase
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            options={opcionesEstados}
            error={errores.estado}
          />

          <ButtonAction type="submit" text="Guardar Datos" />
        </form>
      )}

      {tab === "catalogo" && (
        <div className="catalogo-section">
          <h3>Géneros</h3>
          {generos.map((g) => (
            <label key={g.id}>
              <input
                type="checkbox"
                checked={catData.generos.includes(g.id)}
                onChange={() => toggleMulti("generos", g.id)}
              />
              {g.nombre}
            </label>
          ))}

          <h3>Plataformas</h3>
          {plataformas.map((p) => (
            <label key={p.id}>
              <input
                type="checkbox"
                checked={catData.plataformas.includes(p.id)}
                onChange={() => toggleMulti("plataformas", p.id)}
              />
              {p.nombre}
            </label>
          ))}

          <h3>Empresas</h3>
          {empresas.map((e) => (
            <label key={e.id}>
              <input
                type="checkbox"
                checked={catData.empresas.includes(e.id)}
                onChange={() => toggleMulti("empresas", e.id)}
              />
              {e.nombre}
            </label>
          ))}

          <h3>Desarrolladores</h3>
          {desarrolladores.map((d) => (
            <label key={d.id}>
              <input
                type="checkbox"
                checked={catData.desarrolladores.includes(d.id)}
                onChange={() => toggleMulti("desarrolladores", d.id)}
              />
              {d.nombre}
            </label>
          ))}

          <h3>Imágenes</h3>
          <input type="file" onChange={handleImagen} />

          <ul>
            {catData.imagenes.map((img) => (
              <li key={img.id}>
                {img.url || img.nombre}
                <button type="button" onClick={() => borrarImagen(img.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <ButtonAction text="Guardar Catálogo" onClick={guardarCatalogo} />
        </div>
      )}

      <ButtonAction text="Cerrar" onClick={onCerrar} />
    </div>
  );
}