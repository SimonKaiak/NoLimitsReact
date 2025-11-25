// Ruta: src/pages/Principal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/principal.css";

// Nota general de esta página:
// Aquí se muestra el catálogo principal (películas, videojuegos y accesorios),
// se gestiona el carrito en el frontend y se controla el buscador simple por nombre.

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

// Formatea un número como pesos chilenos.
const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

// ====== Datos de sliders (3 películas, 3 videojuegos, 3 accesorios, cada uno con ID único) ======
const SLIDES = {
  peliculas: [
    {
      id: 1,
      name: "Spider-Man (2002)",
      price: 12990,
      desc: "Título completo: Spider-Man. Autor: Stan Lee y Sam Raimi. Fecha de publicación: 2002. Imagen destacada: Spider-Man enfrentando al Duende Verde. Contenido del artículo: Peter Parker obtiene poderes tras la mordida de una araña y, tras la muerte de su tío Ben, aprende que con gran poder viene gran responsabilidad. Mientras intenta equilibrar su vida personal, enfrenta al Duende Verde en una lucha que define su destino como héroe. Comentarios: ¿Qué opinas de este origen? Comparte tu experiencia.",
      src: img("peliculas/PSpiderman1.webp"),
      alt: "Spider-Man (2002)",
    },
    {
      id: 2,
      name: "Spider-Man 2 (2004)",
      price: 13990,
      desc: "Título completo: Spider-Man 2. Autor: Stan Lee y Sam Raimi. Fecha de publicación: 2004. Imagen destacada: Spider-Man enfrentando a Doctor Octopus. Contenido del artículo: Peter Parker enfrenta deudas, problemas personales y la amenaza del Doctor Octopus mientras sus poderes fallan. Una historia de identidad y deber que muestra que el heroísmo es actuar pese al miedo. Comentarios: ¿Qué opinas de esta entrega? Comparte tu experiencia.",
      src: img("peliculas/PSpiderman2.webp"),
      alt: "Spider-Man 2 (2004)",
    },
    {
      id: 3,
      name: "Spider-Man 3 (2007)",
      price: 11990,
      desc: "Título completo: Spider-Man 3. Autor: Stan Lee y Sam Raimi. Fecha de publicación: 2007. Imagen destacada: Spider-Man bajo la influencia del simbionte. Contenido del artículo: Peter enfrenta al Hombre de Arena y a Venom mientras lucha contra sus propios impulsos oscuros amplificados por el simbionte. Una historia de redención, perdón y responsabilidad que cierra la trilogía poniendo a prueba el corazón del héroe. Comentarios: ¿Qué opinas de esta entrega? Comparte tu experiencia.",
      src: img("peliculas/PSpiderman3.webp"),
      alt: "Spider-Man 3 (2007)",
    },
  ],
  videojuegos: [
    {
      id: 4,
      name: "Spider-Man Remastered",
      price: 69990,
      desc: "Título completo: Spider-Man Remastered. Autor: Insomniac Games y Marvel Games. Fecha de publicación: 2020. Imagen destacada: Spider-Man en acción sobre Nueva York. Contenido del artículo: Peter Parker, con ocho años como Spider-Man, enfrenta a los Demonios Internos liderados por Mister Negative en una historia llena de acción. Incluye combate dinámico, gadgets innovadores y una ciudad de Nueva York detallada con misiones y eventos que enriquecen la experiencia. Comentarios: ¿Qué opinas de este juego? Comparte tu experiencia.",
      src: img("videojuegos/VGSpiderman1.webp"),
      alt: "Spider-Man Remastered",
    },
    {
      id: 5,
      name: "Spider-Man: Miles Morales",
      price: 59990,
      desc: "Título completo: Spider-Man: Miles Morales. Autor: Insomniac Games y Marvel Games. Fecha de publicación: 2020. Imagen destacada: Miles Morales balanceándose entre los rascacielos de Harlem. Contenido del artículo: Miles Morales descubre y domina poderes bioeléctricos y de camuflaje mientras protege Harlem. Una historia de emoción y responsabilidad en un mundo abierto vibrante que pone a prueba su valor como Spider-Man. Comentarios: ¿Qué opinas de este juego? Comparte tu experiencia.",
      src: img("videojuegos/VGSpidermanMM.webp"),
      alt: "Spider-Man Miles Morales",
    },
    {
      id: 6,
      name: "Marvel’s Spider-Man 2",
      price: 72990,
      desc: "Título completo: Marvel’s Spider-Man 2. Autor: Insomniac Games y Marvel Games. Fecha de publicación: 2023. Imagen destacada: Peter y Miles luchando contra Venom. Contenido del artículo: Peter y Miles se unen para enfrentar a Kraven y Venom en un mundo abierto más grande y dinámico, con cambios rápidos entre héroes, nuevos movimientos y gadgets. Una entrega cargada de acción y decisiones que ponen a prueba la destreza de ambos Spider-Man. Comentarios: ¿Qué opinas de esta entrega? Comparte tu experiencia.",
      src: img("videojuegos/VGSpiderman2.webp"),
      alt: "Spider-Man 2",
    },
  ],
  accesorios: [
    {
      id: 7,
      name: "DualSense Spider-Man",
      price: 139990,
      desc: "Título completo: DualSense Spider-Man. Autor: Sony Interactive Entertainment. Fecha de publicación: 2023. Imagen destacada: Control DualSense edición especial Spider-Man con patrón de simbionte. Contenido del artículo: Control edición especial de PS5 con diseño negro y rojo inspirado en el simbionte, logo de la araña y base de carga LED. Ofrece precisión, comodidad y la tecnología háptica característica de la consola en un estilo único para fanáticos de Marvel. Comentarios: ¿Qué opinas de este accesorio? Comparte tu experiencia.",
      src: img("accesorios/ACCSpiderman2.webp"),
      alt: "DualSense Spider-Man",
    },
    {
      id: 8,
      name: "Audífonos Xtech Spiderman WRD LED",
      price: 29990,
      desc: "Título completo: Audífonos Xtech Spiderman Headset WRD LED. Autor: Xtech. Fecha de publicación: 2022. Imagen destacada: Audífonos gamer edición Spider-Man con iluminación LED. Contenido del artículo: Audífonos con diseño negro y rojo, logo de Spider-Man, micrófono ajustable e iluminación LED. Ofrecen comodidad, sonido envolvente y durabilidad para largas sesiones de juego. Comentarios: ¿Qué opinas de este accesorio? Comparte tu experiencia.",
      src: img("accesorios/ACCSpiderman3.webp"),
      alt: "Audífonos Xtech Spiderman WRD LED",
    },
    {
      id: 9,
      name: "Máscara Electrónica de Spider-Man",
      price: 59990,
      desc: "Título completo: Máscara Electrónica de Spider-Man. Autor: Marvel. Imagen destacada: Máscara con detalles electrónicos. Contenido del artículo: Máscara con detalles electrónicos para cosplay/juego, pensada para fans que buscan ambientación y diversión temática. Comentarios: ¿Qué opinas de este accesorio? Comparte tu experiencia.",
      src: img("accesorios/ACCSpiderman1.webp"),
      alt: "Máscara Electrónica de Spider-Man",
    },
  ],
};

// ====== Storage / Carrito ======
// Claves usadas en localStorage para guardar carrito y total.
const STORAGE = { CART: "carrito", TOTAL: "totalCompra" };

// Hook que encapsula toda la lógica del carrito en el frontend.
function useCarrito() {
  // Cargamos el carrito desde localStorage solo una vez al inicio.
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
    } catch {
      return [];
    }
  });

  // Calcula el total del carrito cada vez que cambian los items.
  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
        0
      ),
    [items]
  );

  // Calcula el total de unidades (suma de cantidades) en el carrito.
  const unidades = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0),
    [items]
  );

  // Cada vez que cambia el carrito o el total, se guardan en localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE.CART, JSON.stringify(items));
    localStorage.setItem(STORAGE.TOTAL, String(total));
  }, [items, total]);

  // Agrega un producto al carrito. Si ya existe, solo aumenta la cantidad.
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

  // Aumenta en 1 la cantidad de un ítem específico.
  const inc = (i) =>
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, cantidad: (Number(it.cantidad) || 1) + 1 }
          : it
      )
    );

  // Disminuye en 1 la cantidad de un ítem o lo elimina si llega a cero.
  const dec = (i) =>
    setItems((prev) => {
      const next = [...prev];
      const q = (Number(next[i].cantidad) || 1) - 1;
      if (q <= 0) next.splice(i, 1);
      else next[i] = { ...next[i], cantidad: q };
      return next;
    });

  // Elimina un ítem del carrito según su posición.
  const delItem = (i) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  return { items, total, unidades, add, inc, dec, delItem };
}

// ====== Carrusel de productos por sección (películas, videojuegos, accesorios) ======
function Carousel({ id, sectionKey, onAdd, navH, targetName }) {
  const slides = SLIDES[sectionKey];
  const [i, setI] = useState(0);          // Índice del slide actual.
  const [openInfo, setOpenInfo] = useState(false); // Si se muestra o no la descripción larga.
  const ctaRef = useRef(null);
  const current = slides[i];

  // Títulos bonitos para los botones de navegación entre secciones.
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

  // Secciones relacionadas para los botones dentro del carrusel.
  const RELATED = {
    peliculas: ["videojuegos", "accesorios"],
    videojuegos: ["peliculas", "accesorios"],
    accesorios: ["peliculas", "videojuegos"],
  };

  // Cambia de slide hacia adelante o atrás.
  const go = (dir) => {
    setOpenInfo(false);
    setI((prev) => (prev + dir + slides.length) % slides.length);
  };

  // Efecto visual simple cuando cambia el producto mostrado.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    el.classList.add("nl-cta--fade");
    const t = setTimeout(() => el.classList.remove("nl-cta--fade"), 150);
    return () => clearTimeout(t);
  }, [i]);

  // Cuando viene un producto objetivo desde el buscador, movemos el carrusel a ese ítem.
  useEffect(() => {
    if (!targetName) return;
    const idx = slides.findIndex(
      (s) => s.name.toLowerCase() === targetName.toLowerCase()
    );
    if (idx !== -1) {
      setI(idx);
      setOpenInfo(true); // Abrimos la info para que se note cuál fue el resultado.
    }
  }, [targetName, slides]);

  // Hace scroll hacia la sección indicada.
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
            <div className="nl-slide" key={idx}>
              <img
                className="overlay"
                src={s.src}
                alt={s.alt}
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
          {/* Vista compacta: solo precio y botones básicos */}
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

          {/* Vista extendida: texto completo + navegación a secciones relacionadas */}
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

  // Carrito centralizado usando el hook personalizado.
  const { items, total, unidades, add, inc, dec, delItem } = useCarrito();

  // Controla si el panel del carrito está abierto o cerrado.
  const [cartOpen, setCartOpen] = useState(false);

  // Texto del buscador.
  const [search, setSearch] = useState("");
  // Resultado de búsqueda actual: { section, name } o null.
  const [searchHit, setSearchHit] = useState(null);

  // Altura real del navbar (con un pequeño margen) para usar en offsets de scroll.
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

  // Clase de estilo específica para esta ruta en el body.
  useEffect(() => {
    document.body.classList.add("route-principal");
    return () => document.body.classList.remove("route-principal");
  }, []);

  // Cerrar el carrito con la tecla Escape.
  useEffect(() => {
    const k = (e) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  // Maneja el envío del formulario del buscador.
  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;

    // Buscar en todas las secciones de SLIDES por nombre parcial.
    let found = null;
    for (const [section, arr] of Object.entries(SLIDES)) {
      const idx = arr.findIndex((s) => s.name.toLowerCase().includes(q));
      if (idx !== -1) {
        found = { section, name: arr[idx].name };
        break;
      }
    }

    if (!found) {
      alert("No se encontró ningún producto con ese nombre.");
      return;
    }

    // Guardamos el resultado para que el carrusel pueda posicionarse en el producto exacto.
    setSearchHit(found);

    // Hacemos scroll a la sección encontrada.
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

            {/* Botón para cerrar sesión rápidamente */}
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
                {/* Menú desplegable de categorías con scroll a las secciones */}
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

                {/* Botón para ir al perfil del usuario */}
                <li className="nav-item">
                  <button
                    className="btn-perfil ms-3"
                    onClick={() => navigate("/perfil")}
                  >
                    Perfil
                  </button>
                </li>

                {/* Botón para ir al historial de compras */}
                <li className="nav-item">
                  <button
                    className="btn-perfil ms-3"
                    onClick={() => navigate("/mis-compras")}
                  >
                    Mis Compras
                  </button>
                </li>
              </ul>

              {/* Marca central de la tienda */}
              <h1 id="brand">°-._ NoLimits _.-°</h1>

              {/* Buscador simple por nombre de producto */}
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

              {/* Botón para abrir/cerrar el carrito flotante */}
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

      {/* CONTENIDO PRINCIPAL: LOS TRES CARRUSELES */}
      <main className="productos-container d-flex flex-column align-items-center">
        {/* Sección Películas */}
        <Element name="peliculas">
          <div>
            <h2 id="peliculas-title" className="titulos">
              - Películas -
            </h2>
          </div>
        </Element>
        <Carousel
          id="peliculas"
          sectionKey="peliculas"
          onAdd={add}
          navH={navH}
          targetName={searchHit?.section === "peliculas" ? searchHit.name : null}
        />

        {/* Sección Videojuegos */}
        <Element name="videojuegos">
          <div className="titulos">
            <h2 id="videojuegos-title">- Videojuegos -</h2>
          </div>
        </Element>
        <Carousel
          id="videojuegos"
          sectionKey="videojuegos"
          onAdd={add}
          navH={navH}
          targetName={
            searchHit?.section === "videojuegos" ? searchHit.name : null
          }
        />

        {/* Sección Accesorios */}
        <Element name="accesorios">
          <div>
            <h2 id="accesorios-title" className="titulos">
              - Accesorios -
            </h2>
          </div>
        </Element>
        <Carousel
          id="accesorios"
          sectionKey="accesorios"
          onAdd={add}
          navH={navH}
          targetName={
            searchHit?.section === "accesorios" ? searchHit.name : null
          }
        />
      </main>

      {/* PANEL DEL CARRITO FLOANTE */}
      <div
        className={`fondo-carrito ${cartOpen ? "is-open" : ""}`}
        id="modeloCarrito"
        onClick={(e) => {
          // Si el usuario hace clic fuera del contenido, se cierra el carrito.
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
          <button
            className="btn-comprar"
            onClick={() => navigate("/pago")}
          >
            - Finalizar compra -
          </button>
          <button className="btn-cerrar" onClick={() => setCartOpen(false)}>
            - Cerrar -
          </button>
        </div>
      </div>

      {/* FOOTER CON ENLACE PARA SUBIR Y ENLACES SIMBÓLICOS */}
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