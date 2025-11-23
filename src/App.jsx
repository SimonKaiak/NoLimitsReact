// ✅ Ruta: src/App.jsx

import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layouts
import NavbarNL from "./components/organisms/Navbar.jsx";
import FooterNL from "./components/organisms/Footer.jsx";

// Público
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import PaymentMethod from "./pages/PaymentMethod.jsx";
import { Comprobante } from "./pages/Comprobante.jsx";

// Usuario normal
import Principal from "./pages/Principal.jsx";
import PerfilUsuario from "./pages/PerfilUsuario.jsx";
import EditarPerfil from "./pages/EditarPerfil.jsx";
import MisCompras from "./pages/MisCompras.jsx";

// ADMIN – Dashboard
import AdminHome from "./pages/admin/AdminHome.jsx";

// ADMIN – Productos
import AdminProductList from "./pages/admin/AdminProductList.jsx";

// ADMIN – Catálogos
import AdminTipoProductoList from "./pages/admin/AdminTipoProductoList.jsx";
import AdminClasificacionList from "./pages/admin/AdminClasificacionList.jsx";
import AdminEstadoList from "./pages/admin/AdminEstadoList.jsx";
import AdminGeneroList from "./pages/admin/AdminGeneroList.jsx";
import AdminPlataformaList from "./pages/admin/AdminPlataformaList.jsx";
import AdminEmpresaList from "./pages/admin/AdminEmpresaList.jsx";
import AdminDesarrolladorList from "./pages/admin/AdminDesarrolladorList.jsx";
import AdminCatalogos from "./pages/admin/AdminCatalogos.jsx";
import AdminTipoEmpresaList from "./pages/admin/AdminTipoEmpresaList.jsx";
import AdminTipoDesarrolladorList from "./pages/admin/AdminTipoDesarrolladorList.jsx";

// ADMIN – Métodos
import AdminMetodoPago from "./pages/admin/AdminMetodoPago.jsx";
import AdminMetodoEnvioList from "./pages/admin/AdminMetodoEnvioList.jsx";

// ADMIN – Ventas
import AdminVentasList from "./pages/admin/AdminVentasList.jsx";
import AdminVentaDetalle from "./pages/admin/AdminVentasList.jsx";

import AdminUsuarioList from "./pages/admin/AdminUsuarioList.jsx";

export default function App() {
  const { pathname } = useLocation();

  // Sistema dinámico de clases CSS según la ruta
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(
      "route-home",
      "route-login",
      "route-register",
      "route-principal",
      "route-admin"
    );

    if (pathname === "/login") root.classList.add("route-login");
    else if (pathname === "/registro") root.classList.add("route-register");
    else if (pathname === "/principal") root.classList.add("route-principal");
    else if (pathname.startsWith("/admin")) root.classList.add("route-admin");
    else root.classList.add("route-home");

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Sistema de autenticación
  const isLogged =
    typeof window !== "undefined" &&
    localStorage.getItem("nl_auth") === "1";

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("nl_role")
      : null;

  const isAdmin = isLogged && role === "ADMIN";

  // Ocultar Navbar/Footer cuando se entra al Admin
  const ocultarLayout =
    pathname === "/principal" ||
    pathname === "/olvide-contrasenia" ||
    pathname.startsWith(false);

  return (
    <>
      {!ocultarLayout && <NavbarNL />}

      <main className="main-container">
        <Routes>

          {/* 🌍 PÚBLICO */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-contrasenia" element={<ForgotPasswordPage />} />
          <Route path="/pago" element={<PaymentMethod />} />
          <Route path="/comprobante" element={<Comprobante />} />
          

          {/* 👤 USUARIO NORMAL */}
          <Route
            path="/principal"
            element={isLogged ? <Principal /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/perfil"
            element={isLogged ? <PerfilUsuario /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/perfil/editar"
            element={isLogged ? <EditarPerfil /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/mis-compras"
            element={isLogged ? <MisCompras /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – HOME */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminHome /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – USUARIOS */}
          <Route
            path="/admin/usuarios"
            element={isAdmin ? <AdminUsuarioList /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – PRODUCTOS */}
          <Route
            path="/admin/productos"
            element={isAdmin ? <AdminProductList /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – CATÁLOGOS */}
          <Route
            path="/admin/catalogos"
            element={isAdmin ? <AdminCatalogos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-producto"
            element={isAdmin ? <AdminTipoProductoList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/clasificaciones"
            element={isAdmin ? <AdminClasificacionList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/estados"
            element={isAdmin ? <AdminEstadoList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/generos"
            element={isAdmin ? <AdminGeneroList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/plataformas"
            element={isAdmin ? <AdminPlataformaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/empresas"
            element={isAdmin ? <AdminEmpresaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/desarrolladores"
            element={isAdmin ? <AdminDesarrolladorList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-empresa"
            element={isAdmin ? <AdminTipoEmpresaList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/tipos-desarrollador"
            element={isAdmin ? <AdminTipoDesarrolladorList /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – MÉTODOS */}
          <Route
            path="/admin/metodos-pago"
            element={isAdmin ? <AdminMetodoPago /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/metodos-envio"
            element={isAdmin ? <AdminMetodoEnvioList /> : <Navigate to="/login" replace />}
          />

          {/* 🛠 ADMIN – VENTAS */}
          <Route
            path="/admin/ventas"
            element={isAdmin ? <AdminVentasList /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/admin/ventas/:id"
            element={isAdmin ? <AdminVentaDetalle /> : <Navigate to="/login" replace />}
          />

        </Routes>
      </main>

      {!ocultarLayout && <FooterNL />}
    </>
  );
}
