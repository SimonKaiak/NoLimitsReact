// Ruta: src/components/organisms/SagaCarousel.jsx
import React, { useEffect, useState } from "react";
import {
  obtenerSagas,
  obtenerProductosPorSaga,
} from "../../services/productos";
import "../../styles/sagaCarousel.css";

// Carga todas las imágenes bajo /src/assets/img
const IMGS = import.meta.glob("/src/assets/img/**/*", {
  eager: true,
  as: "url",
});

// Helper para encontrar la imagen correcta (acepta rutas tipo "sagas/..." o "/img/sagas/...")
const img = (p) => {
  if (!p) return "";

  // Normalizamos la ruta para quedarnos con el tramo relativo dentro de /src/assets/img
  const cleaned = p
    .replace(/^\/?img\//i, "")              // "/img/sagas/..." → "sagas/..."
    .replace(/^\/?assets\/img\//i, "")      // "assets/img/sagas/..." → "sagas/..."
    .replace(/^\/?src\/assets\/img\//i, ""); // "src/assets/img/..." → "..."

  const hit = Object.entries(IMGS).find(([k]) =>
    k.toLowerCase().endsWith(cleaned.toLowerCase())
  );

  if (!hit) {
    console.warn("Imagen de saga no encontrada →", p);
    return "";
  }
  return hit[1];
};

// Normaliza el nombre de la saga (sin espacios ni guiones)
const sagaKey = (nombre = "") => nombre.toLowerCase().replace(/[\s-]/g, "");

// Mapeo nombre de saga → imagen local por defecto
const SAGA_IMAGES = {
  // clave normalizada "spiderman" → imagen local
  spiderman: "sagas/SagaSpiderman.webp",
};

export default function SagaCarousel({ onSagaSelect, selectedSagaName }) {
  const [sagas, setSagas] = useState([]);     // [{ nombre, portadaSaga }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);      // índice del slide actual

  useEffect(() => {
    async function cargarSagas() {
      try {
        setLoading(true);
        setError("");

        // Nombres de las sagas desde el backend
        const nombres = await obtenerSagas();

        const sagasConPortada = await Promise.all(
          nombres.map(async (nombre) => {
            try {
              const productos = await obtenerProductosPorSaga(nombre);
              const conPortada =
                productos.find((p) => p.portadaSaga) || productos[0];

              // Fallback local basado en el nombre
              const key = sagaKey(nombre);
              const localPath = SAGA_IMAGES[key] || null;
              const localImg = localPath ? img(localPath) : null;

              // Intentamos primero la portada del backend,
              // asumiendo que manda algo tipo "sagas/SagaSpiderman.webp" o "/img/sagas/..."
              let portadaFromBackend = null;
              if (conPortada?.portadaSaga) {
                portadaFromBackend = img(conPortada.portadaSaga);
              }

              return {
                nombre,
                portadaSaga: portadaFromBackend || localImg || null,
              };
            } catch (e) {
              console.error("Error cargando productos de saga:", nombre, e);

              const key = sagaKey(nombre);
              const localPath = SAGA_IMAGES[key] || null;
              const localImg = localPath ? img(localPath) : null;

              return { nombre, portadaSaga: localImg };
            }
          })
        );

        setSagas(sagasConPortada);
        setIndex(0); // empezamos en la primera saga
      } catch (e) {
        console.error(e);
        setError("Error al cargar las sagas");
      } finally {
        setLoading(false);
      }
    }

    cargarSagas();
  }, []);

  // Si cambia el número de sagas y el índice queda fuera de rango, volvemos a 0
  useEffect(() => {
    if (index >= sagas.length && sagas.length > 0) {
      setIndex(0);
    }
  }, [sagas.length, index]);

  // Si desde fuera cambian selectedSagaName, sincronizamos el índice
  useEffect(() => {
    if (!selectedSagaName || !sagas.length) return;
    const idx = sagas.findIndex((s) => s.nombre === selectedSagaName);
    if (idx !== -1) setIndex(idx);
  }, [selectedSagaName, sagas]);

  const handleClickSaga = (saga) => {
    if (onSagaSelect) onSagaSelect(saga.nombre);
  };

  const move = (dir) => {
    if (!sagas.length) return;
    setIndex((prev) => (prev + dir + sagas.length) % sagas.length);
  };

  if (loading) return <p style={{ color: "white" }}>Cargando sagas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!sagas.length)
    return <p style={{ color: "white" }}>No hay sagas para mostrar.</p>;

  return (
    <div className="carousel-container">
      <div className="saga-carousel">
        <button
          className="saga-arrow saga-arrow-left"
          onClick={() => move(-1)}
          disabled={sagas.length <= 1}
        >
          ❮
        </button>

        {/* Ventana que “recorta” el carrusel (igual idea que el de productos) */}
        <div className="saga-carousel-window">
          <div
            className="saga-carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {sagas.map((saga) => {
              const isActive = selectedSagaName === saga.nombre;
              const hasImage = Boolean(saga.portadaSaga);

              return (
                <div className="saga-slide" key={saga.nombre}>
                  <div
                    className={`saga-card ${isActive ? "is-active" : ""}`}
                    onClick={() => handleClickSaga(saga)}
                  >
                    {hasImage ? (
                      <img
                        src={saga.portadaSaga}
                        alt={saga.nombre}
                        className="saga-card-image"
                      />
                    ) : (
                      <div className="saga-card-placeholder">
                        {saga.nombre?.charAt(0) || "?"}
                      </div>
                    )}

                    <div className="saga-card-info">
                      <h3 className="saga-card-name">{saga.nombre}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="saga-arrow saga-arrow-right"
          onClick={() => move(1)}
          disabled={sagas.length <= 1}
        >
          ❯
        </button>
      </div>
    </div>
  );
}