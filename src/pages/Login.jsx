// ✅ Ruta: src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/login.module.css";
import avatarImg from "../assets/img/fondos/ticket.webp";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("route-login");
    return () => document.documentElement.classList.remove("route-login");
  }, []);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const validar = () => {
    let ok = true;

    if (!EMAIL_RE.test(email)) {
      setEmailErr("* Email inválido");
      ok = false;
    } else setEmailErr("");

    if (pass.trim().length < 6) {
      setPassErr("* Mínimo 6 caracteres");
      ok = false;
    } else setPassErr("");

    return ok;
  };

const onSubmit = async (e) => {
  e.preventDefault();
  if (!validar()) return;

  setSubmitting(true);
  try {
    // 1) Cargar usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios_nl") || "[]");

    // 2) Buscar usuario por correo + pass
    const encontrado = usuarios.find(
      (u) =>
        u.correo.toLowerCase().trim() === email.toLowerCase().trim() &&
        u.contrasena.trim() === pass.trim()
    );

    if (!encontrado) {
      setPassErr("* Correo o contraseña incorrectos.");
      return;
    }

    // 3) Simular delay (opcional)
    await new Promise((r) => setTimeout(r, 600));

    // 4) Guardar sesión
    const user = {
      nombre: encontrado.nombre,
      apellidos: encontrado.apellidos,
      correo: encontrado.correo,
    };

    localStorage.setItem("nl_auth", "1");
    localStorage.setItem("nl_user", JSON.stringify(user));

    // 5) Rol según el usuario encontrado
    const rol = encontrado.rol || "USER";
    localStorage.setItem("nl_role", rol);

    if (rol === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/principal");
    }
  } finally {
    // Siempre se ejecuta, haya salido bien o mal
    setSubmitting(false);
  }
};

  return (
    <main className={styles.page}>
      <section className={styles.section} aria-labelledby="login-title">
        <header className={styles.header}>
          <div className={styles.imageContainer}>
            <div className={styles.image}>
              <img src={avatarImg} alt="avatar" className={styles.avatar} />
            </div>
          </div>
        </header>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* EMAIL */}
          <div className={styles.field}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErr("");
              }}
              aria-describedby="emailError"
              className={styles.input}
              autoComplete="email"
              required
            />
            {emailErr && (
              <small id="emailError" className={styles.error}>
                {emailErr}
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className={styles.field}>
            <input
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setPassErr("");
              }}
              aria-describedby="passError"
              className={styles.input}
              autoComplete="current-password"
              required
            />
            {passErr && (
              <small id="passError" className={styles.error}>
                {passErr}
              </small>
            )}
          </div>

          <Link to="/olvide-contrasenia" className={styles.forgot}>
            - Olvidé mi contraseña -
          </Link>

          <button type="submit" className={styles.btn} disabled={submitting}>
            {submitting ? "Ingresando..." : "- Iniciar Sesión -"}
          </button>
        </form>
      </section>
    </main>
  );
}