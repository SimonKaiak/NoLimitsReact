import { useLocation, useNavigate } from "react-router-dom";

/**
 * AuthCTA
 * - Si estás en /login -> muestra: ¿No tienes una cuenta?  [ - Regístrate - ]
 * - Si estás en /registro -> muestra: ¿Ya tienes una cuenta?  [ - Iniciar Sesión - ]
 * - En otras rutas -> no renderiza nada (null)
 *
 * Props opcionales:
 *  - route: fuerza el modo ("login" o "registro") para usarlo fuera de esas rutas.
 */
export default function AuthCTA({ route }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const mode = route ?? (pathname === "/login" ? "login" : pathname === "/registro" ? "registro" : null);
  if (!mode) return null;

  if (mode === "login") {
    return (
      <>
        <span className="askRight">¿No tienes una cuenta?</span>
        <button className="btn_reg" type="button" onClick={() => navigate("/registro")}>
          - Regístrate -
        </button>
      </>
    );
  }

  return (
    <>
      <span className="askRight">¿Ya tienes una cuenta?</span>
      <button className="btn_in" type="button" onClick={() => navigate("/login")}>
        - Iniciar Sesión -
      </button>
    </>
  );
}