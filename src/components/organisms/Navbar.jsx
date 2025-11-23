import { useNavigate, useLocation } from "react-router-dom";

export default function NavbarNL() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta rutas de auth
  const isLogin = location.pathname === "/login";
  const isRegistro = location.pathname === "/registro";
  const isAuthRoute = isLogin || isRegistro;


  // Detecta rutas admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Página principal ADMIN (NO debe llevar botón volver)
  const isAdminHome = location.pathname === "/admin";

  // Rutas admin que sí usan Volver
  const adminUsesBack = isAdminRoute && !isAdminHome;

  

  // Rutas que usan botón "Volver"
  const hasBackButton =
    location.pathname === "/olvide-contrasenia" ||
    location.pathname === "/pago" ||
    location.pathname === "/perfil" ||
    location.pathname === "/perfil/editar" ||
    location.pathname === "/mis-compras" ||
    adminUsesBack; // Admin tambien usa botones "Volver"

  // Rutas donde NO queremos botones a la derecha
  const hideRightSide = hasBackButton ||
   location.pathname === "/comprobante" ||
   isAdminRoute; // Ocultamos botones en admin

  const isLogged =
    typeof window !== "undefined" &&
    localStorage.getItem("nl_auth") === "1";

  return (
    <nav className={`nl-nav ${isAuthRoute ? "nl-auth-mode" : ""}`}>
      <div className="nl-nav-inner">
        {/* IZQUIERDA */}
        <div className="nl-left">

          {/* SOLO EN HOME */}
          {location.pathname === "/" && (
            <a
              href="/manual/ManualUsuario_NoLimits.pdf"
              download
              className="btn_manual"
            >
              - Manual de Usuario -
            </a>
          )}

          {isAuthRoute && (
            <button className="btnSalirNav" onClick={() => navigate("/")}>
              - Salir al Lobby -
            </button>
          )}

          {hasBackButton && (
            <button className="btn_salir" onClick={() => navigate(-1)}>
              - Volver -
            </button>
          )}
        </div>


        {/* CENTRO BRAND */}
        <h1 id="brand">°-._ NoLimits _.-°</h1>

        {/* DERECHA */}
        <div className="nl-right">
          {/* Vista Login */}
          {isLogin && (
            <>
              <span className="askRight">¿No tienes una cuenta?</span>
              <button
                className="btn_reg"
                onClick={() => navigate("/registro")}
              >
                - Regístrate -
              </button>
            </>
          )}

          {/* Vista Registro */}
          {isRegistro && (
            <>
              <span className="askRight">¿Ya tienes una cuenta?</span>
              <button className="btn_in" onClick={() => navigate("/login")}>
                - Iniciar Sesión -
              </button>
            </>
          )}

          {/* Rutas normales (home) */}
          {!isAuthRoute && !hideRightSide && (
            <>
              {isLogged && location.pathname !== "/" && (
                <button
                  className="btn_in"
                  onClick={() => navigate("/principal")}
                >
                  - Catálogo -
                </button>
              )}
              <button className="btn_in" onClick={() => navigate("/login")}>
                - Iniciar Sesión -
              </button>
              <button className="btn_reg" onClick={() => navigate("/registro")}>
                - Registrarse -
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}