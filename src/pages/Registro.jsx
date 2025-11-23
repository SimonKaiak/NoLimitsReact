// Ruta: src/pages/Registro.jsx

import React, { useState, useEffect } from "react";
import styles from "../styles/registro.module.css";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/usuarios";

export default function Registro() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("route-register");
    return () => document.documentElement.classList.remove("route-register");
  }, []);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    contrasena: "",
    contrasena2: "",
  });

  const [errores, setErrores] = useState({});

  const esEmailValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

  const esTelefonoCLValido = (t) => {
    const soloDigitos = t.replace(/\D/g, "");
    return (
      soloDigitos.length === 9 ||
      soloDigitos.length === 11 ||
      soloDigitos.length === 12
    );
  };

  const setError = (k, m) => setErrores((p) => ({ ...p, [k]: m }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError(name, "");
    setError("general", "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valido = true;
    const err = {};

    const { nombre, apellidos, correo, telefono, contrasena, contrasena2 } =
      formData;

    if (!nombre) (err.nombre = "* El nombre es obligatorio.", (valido = false));
    if (!apellidos)
      (err.apellidos = "* Los apellidos son obligatorios.", (valido = false));

    if (!correo) (err.correo = "* El correo es obligatorio.", (valido = false));
    else if (!esEmailValido(correo))
      (err.correo = "* Ingresa un correo válido.", (valido = false));

    if (!telefono)
      (err.telefono = "* El teléfono es obligatorio.", (valido = false));
    else if (!esTelefonoCLValido(telefono))
      (err.telefono = "* Formato válido: +56 9 1234 5678.", (valido = false));

    if (!contrasena)
      (err.contrasena = "* La contraseña es obligatoria.", (valido = false));
    else if (contrasena.length < 8)
      (err.contrasena = "* Mínimo 8 caracteres.", (valido = false));
    else if (contrasena.length > 10)
      (err.contrasena = "* Máximo 10 caracteres.", (valido = false));

    if (!contrasena2)
      (err.contrasena2 = "* Repite la contraseña.", (valido = false));
    else if (contrasena !== contrasena2)
      (err.contrasena2 = "* Las contraseñas no coinciden.", (valido = false));

    if (!valido) {
      setErrores(err);
      return;
    }

    try {
      await registrarUsuario(formData);

      alert("✅ Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setErrores((prev) => ({
        ...prev,
        general: error.message || "Error al registrar usuario",
      }));
    }
  };

  return (
    <>
      <div className={styles.bg} aria-hidden />

      <main className={styles.page}>
        <form
          className={`${styles.card} ${styles.formGrid}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className={`${styles.title} ${styles.span2}`}>
            Ingresa tus datos
          </h2>

          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Apellidos", name: "apellidos", type: "text" },
            { label: "Correo", name: "correo", type: "email" },
            { label: "Teléfono", name: "telefono", type: "tel" },
          ].map(({ label, name, type }) => (
            <div className={styles.field} key={name}>
              <label className={styles.label}>{label}</label>
              <input
                className={styles.input}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
              {errores[name] && (
                <small className={styles.error}>{errores[name]}</small>
              )}
            </div>
          ))}

          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              minLength={8}
              maxLength={10}
            />
            {errores.contrasena && (
              <small className={styles.error}>{errores.contrasena}</small>
            )}
          </div>

          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Repetir Contraseña</label>
            <input
              className={styles.input}
              type="password"
              name="contrasena2"
              value={formData.contrasena2}
              onChange={handleChange}
            />
            {errores.contrasena2 && (
              <small className={styles.error}>{errores.contrasena2}</small>
            )}
          </div>

          {errores.general && (
            <p className={`${styles.error} ${styles.span2}`}>
              {errores.general}
            </p>
          )}

          <div className={`${styles.actions} ${styles.span2}`}>
            <button type="submit" className={styles.primary}>
              <strong>- Registrarse -</strong>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}