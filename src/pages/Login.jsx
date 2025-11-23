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
    const res = await fetch(
      "https://nolimits-backend-final.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          password: pass,
        }),
      }
    );

    if (!res.ok) {
      setPassErr("* Correo o contraseña incorrectos.");
      return;
    }

    const data = await res.json();

    localStorage.setItem("nl_auth", "1");
    localStorage.setItem("nl_user", JSON.stringify(data));
    localStorage.setItem("nl_role", data.rol);

    if (data.rol === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/principal");
    }

  } catch (error) {
    console.error(error);
    setPassErr("❌ Error al conectar con el servidor");
  } finally {
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