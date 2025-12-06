// Ruta: src/pages/Principal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/principal.css";
import SagaCarousel from "../components/organisms/SagaCarousel";
import { obtenerProductosPorSaga } from "../services/productos";

// Carga todo lo que haya bajo /src/assets/img y deja lista la URL para usarla en <img src="...">
const IMGS = import.meta.glob("../assets/img/**/*", { eager: true, as: "url" });

// Función auxiliar para encontrar la imagen correcta a partir de una ruta relativa.
const img = (p) => {
  const needle = (`../assets/img/${p}`).replace(/\\/g, "/").toLowerCase();
  let hit = Object.entries(IMGS).find(([k]) => k.toLowerCase() === needle);
  if (!hit) {
    const tail = needle.replace("../assets/img/", "");
    hit = Object.entries(IMGS).find(([k]) => k.toLowerCase().endsWith(tail));
  }
  if (!hit) {
    console.warn("Imagen no encontrada →", p);
    return "";
  }
  return hit[1];
};

// Mapeo simple nombre → imagen local.)
const PRODUCT_IMAGES = {
  // Spider-Man Peliculas.
  "spiderman 1": "peliculas/spiderman/PSpiderman1.webp",
  "spiderman 2": "peliculas/spiderman/PSpiderman2.webp",
  "spiderman 3": "peliculas/spiderman/PSpiderman3.webp",
  // Spider-Man Videojuegos.
  "marvel's spider-man remastered": "videojuegos/spiderman/VGSpiderman1.webp",
  "spider-man: miles morales": "videojuegos/spiderman/VGSpidermanMM.webp",
  "marvel's spider-man 2": "videojuegos/spiderman/VGSpiderman2.webp",
  // Spider-Man Accesorios.
  "máscara de spider-man – edición de colección": "accesorios/spiderman/ACCSpiderman1.webp",
  "control dualsense ps5 – edición spider-man (diseño venom / simbionte)": "accesorios/spiderman/ACCSpiderman2.webp",
  "audífonos gamer spider-man – edición marvel": "accesorios/spiderman/ACCSpiderman3.webp",

  // Minecraft Peliculas
  "una pelicula de minecraft": "peliculas/minecraft/PMinecraft.webp",
  "una película de minecraft": "peliculas/minecraft/PMinecraft.webp",
  // Minecraft Videojuegos
  "minecraft: java & bedrock": "videojuegos/minecraft/VGMinecraftJyB.webp",
  "minecraft: dungeons": "videojuegos/minecraft/VGMinecraftDungeons.webp",
  // Minecraft Accesorios.
  "lámpara abeja minecraft": "accesorios/minecraft/ACCMinecraft1.webp",
  "audífonos gamer minecraft - edición mojang": "accesorios/minecraft/ACCMinecraft2.webp",
  "preservativo minecraft": "accesorios/minecraft/ACCMinecraft3.webp",

};

// Formatea un número como pesos chilenos.
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

// ====== Storage / Carrito ======
const STORAGE = { CART: "carrito", TOTAL: "totalCompra" };

// Hook que encapsula toda la lógica del carrito en el frontend.
function useCarrito() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
    } catch {
      return [];
    }
  });

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
        0
      ),
    [items]
  );

  const unidades = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0),
    [items]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE.CART, JSON.stringify(items));
    localStorage.setItem(STORAGE.TOTAL, String(total));
  }, [items, total]);

  const add = (idProducto, nombre, precio) =>
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.idProducto === idProducto);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          cantidad: (Number(next[idx].cantidad) || 1) + 1,
        };
        return next;
      }
      return [
        ...prev,
        { idProducto, nombre, precio: Number(precio), cantidad: 1 },
      ];
    });

  const inc = (i) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, cantidad: (Number(it.cantidad) || 1) + 1 }
          : it
      )
    );

  const dec = (i) =>
    setItems((prev) => {
      const next = [...prev];
      const q = (Number(next[i].cantidad) || 1) - 1;
      if (q <= 0) next.splice(i, 1);
      else next[i] = { ...next[i], cantidad: q };
      return next;
    });

  const delItem = (i) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  return { items, total, unidades, add, inc, dec, delItem };
}

// ====== Carrusel de productos por sección ======
function Carousel({ id, productos, sectionKey, onAdd, navH, targetName }) {
  const slides = productos || [];
  const [i, setI] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const ctaRef = useRef(null);

  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (!hasSlides) return;
    if (i >= slides.length) {
      setI(0);
      setOpenInfo(false);
    }
  }, [hasSlides, slides.length, i]);

  useEffect(() => {
    if (!hasSlides) return;
    const el = ctaRef.current;
    if (!el) return;
    el.classList.add("nl-cta--fade");
    const t = setTimeout(() => el.classList.remove("nl-cta--fade"), 150);
    return () => clearTimeout(t);
  }, [hasSlides, i]);

  useEffect(() => {
    if (!hasSlides || !targetName) return;
    const idx = slides.findIndex(
      (s) => s.name.toLowerCase() === targetName.toLowerCase()
    );
    if (idx !== -1) {
      setI(idx);
      setOpenInfo(true);
    }
  }, [hasSlides, targetName, slides]);

  if (!hasSlides) {
    return (
      <section className={`producto card p-2 m-2 ${sectionKey}`} id={id}>
        <div className="nl-carousel nl-carousel--empty">
          <p className="text-center text-muted m-0">
            No hay productos disponibles en esta categoría.
          </p>
        </div>
      </section>
    );
  }

  const current = slides[i];

  const pretty = {
    peliculas: "- Películas -",
    videojuegos: "- Videojuegos -",
    accesorios: "- Accesorios -",
  };
  const titleId = {
    peliculas: "peliculas",
    videojuegos: "videojuegos",
    accesorios: "accesorios",
  };

  const RELATED = {
    peliculas: ["videojuegos", "accesorios"],
    videojuegos: ["peliculas", "accesorios"],
    accesorios: ["peliculas", "videojuegos"],
  };

  const go = (dir) => {
    setOpenInfo(false);
    setI((prev) => (prev + dir + slides.length) % slides.length);
  };

  const jumpTo = (name) => {
    scroller.scrollTo(name, { smooth: true, duration: 600, offset: -navH });
  };

  const related = RELATED[sectionKey];

  return (
    <section className={`producto card p-2 m-2 ${sectionKey}`} id={id}>
      <div className="nl-carousel">
        <button className="nl-prev" onClick={() => go(-1)}>
          ❮-
        </button>

        <div
          className="nl-carousel-track"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div className="nl-slide" key={s.id ?? idx}>
              <img
                className="overlay"
                src={s.src}
                alt={s.alt || s.name}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button className="nl-next" onClick={() => go(1)}>
          -❯
        </button>

        <div
          className={`nl-cta ${openInfo ? "is-open" : "is-closed"}`}
          ref={ctaRef}
        >
          {!openInfo && (
            <>
              <strong className="nl-price">{clp(current.price)}</strong>
              <div className="nl-actions">
                <button
                  className="btn btn-info"
                  onClick={() => setOpenInfo(true)}
                >
                  - Más información -
                </button>
                <button
                  className="btn btn-success nl-add"
                  onClick={() =>
                    onAdd(current.id, current.name, current.price)
                  }
                >
                  - Agregar -
                </button>
              </div>
            </>
          )}

          {openInfo && (
            <>
              <div
                className="nl-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-info"
                  onClick={() => setOpenInfo(false)}
                >
                  - Menos información -
                </button>
                <strong className="nl-price" style={{ margin: 0 }}>
                  {clp(current.price)}
                </strong>
                <button
                  className="btn btn-success nl-add"
                  onClick={() =>
                    onAdd(current.id, current.name, current.price)
                  }
                >
                  - Agregar -
                </button>
              </div>

              <div className="nl-info mt-2">
                <div className="card card-body">
                  <strong>{current.desc}</strong>
                </div>
              </div>

              <div
                className="nl-related mt-2"
                style={{
                  display: "flex",
                  gap: ".75rem",
                  justifyContent: "center",
                }}
              >
                {related.map((key) => (
                  <button
                    key={key}
                    className="btn btn-outline-info nl-link"
                    onClick={() => jumpTo(titleId[key])}
                  >
                    {pretty[key]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ====== Componente Principal de la ruta /principal ======
export default function Principal() {
  const navigate = useNavigate();

  const [selectedSaga, setSelectedSaga] = useState(null);

  const [peliculas, setPeliculas] = useState([]);
  const [videojuegos, setVideojuegos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  const { items, total, unidades, add, inc, dec, delItem } = useCarrito();

  const [cartOpen, setCartOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [searchHit, setSearchHit] = useState(null);

  const [navH, setNavH] = useState(120);

  useEffect(() => {
    const calc = () => {
      const nav = document.querySelector(
        "nav.navbar.bg-body-tertiary.fixed-top"
      );
      setNavH(((nav?.offsetHeight) || 120) + 10);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    document.body.classList.add("route-principal");
    return () => document.body.classList.remove("route-principal");
  }, []);

  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

    // Cargar productos SOLO cuando haya saga seleccionada
    useEffect(() => {
      if (!selectedSaga) {
        setPeliculas([]);
        setVideojuegos([]);
        setAccesorios([]);
        return;
      }

      async function cargarProductosDeSaga() {
        try {
          const data = await obtenerProductosPorSaga(selectedSaga);
          console.log(
            "Productos recibidos en Principal para saga:",
            selectedSaga,
            data
          );

          if (!Array.isArray(data)) return;

          const mapToSlide = (p) => {
          const key = p.nombre?.toLowerCase() || "";
          const localImage = PRODUCT_IMAGES[key] || "logos/NoLimits.webp";

          return {
            id: p.id,
            name: p.nombre,
            price: p.precio,
            desc:
              p.descripcion ||
              `Producto ${p.nombre} de la categoría ${p.tipoProductoNombre || ""}.`,
            src: img(localImage),
            alt: p.nombre,
          };
        };

          const getTipo = (p) =>
            (p.tipoProductoNombre || p.tipoProducto || p.tipo || "")
              .toString()
              .toLowerCase()
              .normalize("NFD")               // separa letras y tildes
              .replace(/[\u0300-\u036f]/g, ""); // elimina tildes

          const peliculasData = data.filter((p) =>
            getTipo(p).includes("pelic")
          );

          // ORDEN PERSONALIZADO PARA VIDEOJUEGOS DE MINECRAFT
          const minecraftOrder = [
            "minecraft: java & bedrock",
            "minecraft: dungeons"
          ];

          let videojuegosData = data
            .filter((p) => getTipo(p).includes("video"))
            .sort((a, b) => {
              const aName = a.nombre.toLowerCase();
              const bName = b.nombre.toLowerCase();

              const aIdx = minecraftOrder.indexOf(aName);
              const bIdx = minecraftOrder.indexOf(bName);

              // Los que no estén en la lista se van al final
              if (aIdx === -1 && bIdx === -1) return 0;
              if (aIdx === -1) return 1;
              if (bIdx === -1) return -1;

              return aIdx - bIdx;
            });

          // Accesorios
          let accesoriosData = data.filter((p) =>
            getTipo(p).includes("acces")
          );

          // Orden personalizado SOLO para Minecraft
          const minecraftAccOrder = [
            "lámpara abeja minecraft",
            "audífonos gamer minecraft - edición mojang",
            "preservativo minecraft",
          ];

          if ((selectedSaga || "").toLowerCase() === "minecraft") {
            accesoriosData = accesoriosData.sort((a, b) => {
              const aName = a.nombre.toLowerCase();
              const bName = b.nombre.toLowerCase();

              const aIdx = minecraftAccOrder.indexOf(aName);
              const bIdx = minecraftAccOrder.indexOf(bName);

              if (aIdx === -1 && bIdx === -1) return 0;
              if (aIdx === -1) return 1;
              if (bIdx === -1) return -1;

              return aIdx - bIdx;
            });
          }

          setPeliculas(peliculasData.map(mapToSlide));
          setVideojuegos(videojuegosData.map(mapToSlide));
          setAccesorios(accesoriosData.map(mapToSlide));
        } catch (err) {
          console.error("Error cargando productos de saga:", err);
        }
      }

      cargarProductosDeSaga();
    }, [selectedSaga]);

  const sagaLabel = selectedSaga || "";

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;

    if (!selectedSaga) {
      alert("Primero selecciona una saga del carrusel.");
      return;
    }

    const secciones = {
      peliculas,
      videojuegos,
      accesorios,
    };

    let found = null;
    for (const [section, arr] of Object.entries(secciones)) {
      const idx = arr.findIndex((s) => s.name.toLowerCase().includes(q));
      if (idx !== -1) {
        found = { section, name: arr[idx].name };
        break;
      }
    }

    if (!found) {
      alert(
        "No se encontró ningún producto con ese nombre en la saga seleccionada."
      );
      return;
    }

    setSearchHit(found);

    scroller.scrollTo(found.section, {
      smooth: true,
      duration: 600,
      offset: -navH,
    });
  };

  return (
    <div id="top">
      <Element name="top" />

      {/* NAVBAR PRINCIPAL */}
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <button
              className="btn-cerrarSesion"
              onClick={() => {
                localStorage.removeItem("nl_auth");
                window.location.href = "/";
              }}
            >
              Cerrar sesión
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle btn-categoria"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Categorías
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="peliculas"
                        smooth={true}
                        offset={-(navH + 40)}
                        duration={50}
                      >
                        Películas
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="videojuegos"
                        smooth={true}
                        offset={-(navH + 40)}
                        duration={50}
                      >
                        Videojuegos
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="accesorios"
                        smooth={true}
                        offset={-(navH - 120)}
                        duration={50}
                      >
                        Accesorios
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <button
                    className="btn-perfil ms-3"
                    onClick={() => navigate("/perfil")}
                  >
                    Perfil
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="btn-perfil ms-3"
                    onClick={() => navigate("/mis-compras")}
                  >
                    Mis Compras
                  </button>
                </li>
              </ul>

              <h1 id="brand">°-._ NoLimits _.-°</h1>

              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="icon-btn">
                  <span className="icon">🔍</span>
                </button>
              </form>

              <button
                className="carrito-btn"
                onClick={() => setCartOpen((v) => !v)}
              >
                🛒 <span id="contador">{unidades}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO PRINCIPAL */}
      <header className="page-hero text-center">
        <p className="page-subtitle">
          _.- Variedad, estilo y calidad en un solo lugar -._
          <span className="sub-underline"></span>
        </p>
        <div className="hero-logo">
          <img
            src={img("logos/NoLimits.webp")}
            alt="Logo NoLimits"
            className="hero-logo-img"
            loading="lazy"
          />
        </div>
      </header>

      {/* SAGAS DESTACADAS */}
      <section className="sagas-section">
        <h2 className="sagas-title">- Sagas destacadas -</h2>
        <SagaCarousel
          onSagaSelect={setSelectedSaga}
          selectedSagaName={selectedSaga}
        />
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="productos-container d-flex flex-column align-items-center">
        {!selectedSaga && (
        <div className="saga-helper-wrapper">
          <p className="saga-helper-banner">
            _.- Selecciona una saga del carrusel superior para ver las películas,
            videojuegos y accesorios relacionados -._
            <span className="saga-helper-underline"></span>
          </p>
        </div>
      )}

        {selectedSaga && (
          <>
            {/* Películas */}
            <Element name="peliculas">
              <div>
                <h2 id="peliculas-title" className="titulos">
                  - Películas{ sagaLabel ? ` : ${sagaLabel}` : "" } -
                </h2>
              </div>
            </Element>
            <Carousel
              id="peliculas"
              sectionKey="peliculas"
              productos={peliculas}
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "peliculas" ? searchHit.name : null
              }
            />

            {/* Videojuegos */}
            <Element name="videojuegos">
              <div className="titulos">
                <h2 id="videojuegos-title">
                  - Videojuegos{ sagaLabel ? ` : ${sagaLabel}` : "" } -
                </h2>
              </div>
            </Element>
            <Carousel
              id="videojuegos"
              sectionKey="videojuegos"
              productos={videojuegos}
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "videojuegos" ? searchHit.name : null
              }
            />

            {/* Accesorios */}
            <Element name="accesorios">
              <div>
                <h2 id="accesorios-title" className="titulos">
                  - Accesorios{ sagaLabel ? ` : ${sagaLabel}` : "" } -
                </h2>
              </div>
            </Element>
            <Carousel
              id="accesorios"
              sectionKey="accesorios"
              productos={accesorios}
              onAdd={add}
              navH={navH}
              targetName={
                searchHit?.section === "accesorios" ? searchHit.name : null
              }
            />
          </>
        )}
      </main>

      {/* PANEL DEL CARRITO FLOANTE */}
      <div
        className={`fondo-carrito ${cartOpen ? "is-open" : ""}`}
        id="modeloCarrito"
        onClick={(e) => {
          if (e.target.id === "modeloCarrito") setCartOpen(false);
        }}
      >
        <div className="modelo-contenido animar">
          <h2>Tu Carrito</h2>
          <ul id="carrito">
            {items.map((it, idx) => {
              const subtotal = Number(it.precio) * Number(it.cantidad);
              return (
                <li
                  key={idx}
                  className="d-flex justify-content-between align-items-center gap-2"
                >
                  <span>
                    {it.nombre}{" "}
                    <small className="text-muted">(x{it.cantidad})</small> —{" "}
                    {clp(subtotal)}
                  </span>
                  <span className="d-inline-flex gap-1">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => dec(idx)}
                    >
                      -
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => inc(idx)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => delItem(idx)}
                    >
                      ❌
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          <h3>
            Total: <span id="total">{clp(total)}</span>
          </h3>
          <button className="btn-comprar" onClick={() => navigate("/pago")}>
            - Finalizar compra -
          </button>
          <button className="btn-cerrar" onClick={() => setCartOpen(false)}>
            - Cerrar -
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <nav className="nl-nav1">
          <div className="nl-nav1-inner">
            <div className="nl-nav1-left">
              <Link
                className="nl-nav1-item"
                to="top"
                smooth={true}
                offset={-(navH + 100)}
                duration={50}
              >
                ⬆️ <span>- Subir -</span>
              </Link>
            </div>
            <div className="nl-nav1-center">
              <span id="sub-brand">_.-°-._ All in One _.-°-._</span>
            </div>
            <div className="nl-nav1-right">
              <small className="footer-copy">- © 2025 NoLimits SPA -</small>
              <a className="nl-nav1-item" href="#">
                📄 <span>- Términos -</span>
              </a>
              <a className="nl-nav1-item" href="#">
                🔒 <span>- Privacidad -</span>
              </a>
            </div>
          </div>
        </nav>
      </footer>
    </div>
  );
}