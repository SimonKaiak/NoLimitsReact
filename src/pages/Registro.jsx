// Ruta: src/pages/Registro.jsx

import React, { useState, useEffect } from "react";
import styles from "../styles/registro.module.css";
import { useNavigate } from "react-router-dom";
import { crearUsuario } from "../services/usuarios";
import { crearDireccion } from "../services/direcciones";

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
    direccion: "",
    contrasena: "",
    contrasena2: "",
  });

  const [errores, setErrores] = useState({});

  const esEmailValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

  const esTelefonoCLValido = (t) => {
    const soloDigitos = t.replace(/\D/g, "");
    return soloDigitos.length === 9 || soloDigitos.length === 11 || soloDigitos.length === 12;
  };

  const normalizarTelefono = (t) => {
    const soloDigitos = t.replace(/\D/g, "");
    if (soloDigitos.length <= 9) return soloDigitos;
    return soloDigitos.slice(-9);
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

    const { nombre, apellidos, correo, telefono, direccion, contrasena, contrasena2 } = formData;

    // --- VALIDACIONES (igual que ya tenías) ---
    if (!nombre) (err.nombre = "* El nombre es obligatorio.", (valido = false));
    if (!apellidos) (err.apellidos = "* Los apellidos son obligatorios.", (valido = false));

    if (!correo) (err.correo = "* El correo es obligatorio.", (valido = false));
    else if (!esEmailValido(correo)) (err.correo = "* Ingresa un correo válido.", (valido = false));

    if (!telefono) (err.telefono = "* El teléfono es obligatorio.", (valido = false));
    else if (!esTelefonoCLValido(telefono))
      (err.telefono = "* Formato válido: +56 9 1234 5678.", (valido = false));

    if (!direccion) (err.direccion = "* La dirección es obligatoria.", (valido = false));

    if (!contrasena) (err.contrasena = "* La contraseña es obligatoria.", (valido = false));
    else if (contrasena.length < 8)
      (err.contrasena = "* Mínimo 8 caracteres.", (valido = false));

    if (!contrasena2) (err.contrasena2 = "* Repite la contraseña.", (valido = false));
    else if (contrasena !== contrasena2)
      (err.contrasena2 = "* Las contraseñas no coinciden.", (valido = false));

    if (!valido) {
      setErrores(err);
      return;
    }

    try {
      const telefonoNormalizado = normalizarTelefono(telefono);

      // 1) Crear USUARIO (igual que antes)
      const usuarioPayload = {
        nombre,
        apellidos,
        correo,
        telefono: parseInt(telefonoNormalizado, 10),
        password: contrasena,
        rol: { id: 1 }, // o el rol que corresponda
      };

      const usuarioCreado = await crearUsuario(usuarioPayload);
      // aquí asumo que crearUsuario devuelve directamente el objeto usuario.
      // Si devuelve { data: usuario }, tendrías que hacer: const usuarioCreado = (await crearUsuario(usuarioPayload)).data;

      // 2) Armar la DIRECCIÓN igual que en Swagger

      // Ejemplo de input: "Av mi casa #6544, Depto 301"
      const [parteCalle, parteResto] = direccion.split("#");
      const calle = (parteCalle || "").trim();
      const numeroYComp = (parteResto || "").trim(); // "6544, Depto 301"

      let numero = "";
      let complemento = "";

      if (numeroYComp) {
        const partes = numeroYComp.split(",");
        numero = (partes[0] || "").trim();           // "6544"
        complemento = (partes[1] || "").trim();      // "Depto 301" (si lo puso)
      }

      const direccionPayload = {
        calle,                         // "Av mi casa"
        numero: numero || "S/N",       // "6544" o "S/N"
        complemento: complemento || "",// "Depto 301" o vacío
        codigoPostal: "0000000",       // mismo que usaste en Swagger
        comuna: { id: 1 },             // por ahora fijo: comuna 1 (Santiago en Render)
        usuarioModel: { id: usuarioCreado.id }, // ID real que volvió del backend
        activo: true,
      };

      await crearDireccion(direccionPayload);

      alert("✅ Usuario y dirección registrados correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setErrores((prev) => ({
        ...prev,
        general: "Error al registrar usuario y dirección",
      }));
      alert("❌ Error al registrar usuario o dirección");
    }
  };


  return (
    <>
      <div className={styles.bg} aria-hidden />

      <main className={styles.page}>
        <form className={`${styles.card} ${styles.formGrid}`} onSubmit={handleSubmit} noValidate>
          <h2 className={`${styles.title} ${styles.span2}`}>Ingresa tus datos</h2>

          {[
            { label: "Nombre", name: "nombre", type: "text", placeholder: "Nombre" },
            { label: "Apellidos", name: "apellidos", type: "text", placeholder: "Apellidos" },
            { label: "Correo", name: "correo", type: "email", placeholder: "Ejemplo: NoLimitsCorp@gmail.com" },
            { label: "Teléfono", name: "telefono", type: "tel", placeholder: "+56 9 1234 5678" },
          ].map(({ label, name, type, placeholder }) => (
            <div className={styles.field} key={name}>
              <label className={styles.label} htmlFor={name}>{label}</label>
              <input
                className={styles.input}
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
              />
              {errores[name] && <small className={styles.error}>{errores[name]}</small>}
            </div>
          ))}

          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label} htmlFor="direccion">Dirección</label>
            <input
              className={styles.input}
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Ej: Av. Mi Casa #1234, Depto 45, Ciudad"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
            {errores.direccion && <small className={styles.error}>{errores.direccion}</small>}
          </div>

          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>Repetir Contraseña</label>
            <input
              className={styles.input}
              type="password"
              name="contrasena2"
              value={formData.contrasena2}
              onChange={handleChange}
              required
            />
          </div>

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