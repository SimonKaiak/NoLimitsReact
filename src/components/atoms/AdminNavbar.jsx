// Ruta: src/components/atoms/AdminNavbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Controla si el submenú de Catálogos está abierto
  const [openCatalogos, setOpenCatalogos] = useState(false);

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
    setOpenCatalogos(false); // cierra el submenú cuando se navega
  };

  return (
    <>
      <nav className="nl-nav">
        <div className="nl-nav-inner">

          {/* IZQUIERDA → HAMBURGUESA */}
          <div className="nl-left">
            <button
              className="btn_in"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>

          {/* CENTRO */}
          <h1 id="brand">°-._ NoLimits _.-°</h1>

          {/* DERECHA VACÍA */}
          <div className="nl-right"></div>
        </div>
      </nav>

      {/* PANEL LATERAL */}
      {menuOpen && (
        <div className="admin-sidebar">

          <div className="admin-sidebar-header">
            <button onClick={() => setMenuOpen(false)}>✖</button>
          </div>

          {/* BOTÓN PRODUCTOS */}
          <button onClick={() => go("/admin/productos")}>- Productos -</button>

          {/* BOTÓN CATÁLOGOS → DESPLEGABLE */}
          <button onClick={() => setOpenCatalogos(!openCatalogos)}>
            {openCatalogos ? "▼ Catálogos -" : "- Catálogos -"}
          </button>

          {/* SUBMENÚ DE CATÁLOGOS */}
          {openCatalogos && (
            <div className="submenu-catalogos">
              <button onClick={() => go("/admin/tipos-producto")}>Tipos de Producto</button>
              <button onClick={() => go("/admin/clasificaciones")}>Clasificaciones</button>
              <button onClick={() => go("/admin/estados")}>Estados</button>
              <button onClick={() => go("/admin/generos")}>Géneros</button>
              <button onClick={() => go("/admin/plataformas")}>Plataformas</button>
              <button onClick={() => go("/admin/empresas")}>Empresas</button>

              {/* 👉 NUEVOS */}
              <button onClick={() => go("/admin/tipos-empresa")}>Tipos de Empresa</button>
              <button onClick={() => go("/admin/desarrolladores")}>Desarrolladores</button>
              <button onClick={() => go("/admin/tipos-desarrollador")}>Tipos de Desarrollador</button>

              <button onClick={() => go("/admin/metodos-pago")}>Métodos de Pago</button>
              <button onClick={() => go("/admin/metodos-envio")}>Métodos de Envío</button>
            </div>
          )}

          {/* BOTONES RESTANTES */}
          <button onClick={() => go("/admin/usuarios")}>- Usuarios -</button>
          <button onClick={() => go("/admin/ventas")}>- Ventas -</button>

          <button
            style={{
              marginTop: "20px",
              borderColor: "#ff25d0",
              color: "#ff25d0"
            }}
            onClick={() => go("/")}
          >
            - Salir del Admin -
          </button>

        </div>
      )}
    </>
  );
}