import { useEffect, useState } from "react";
import styles from "../styles/perfilUsuario.css";
import { obtenerUsuario, editarUsuario } from "../services/usuarios";
import { obtenerRegiones } from "../services/regiones";
import { obtenerComunas } from "../services/comunas";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const usuarioId = localStorage.getItem("nl_user_id"); // ID real

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    calle: "",
    numero: "",
    complemento: "",
    codigoPostal: "",
    regionId: "",
    comunaId: ""
  });

  useEffect(() => {
    obtenerRegiones().then(setRegiones);

    if (!usuarioId) return;

    obtenerUsuario(usuarioId).then(data => {
      setUsuario(data);

      setFormData({
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono: data.telefono,
        calle: data.direccion?.calle || "",
        numero: data.direccion?.numero || "",
        complemento: data.direccion?.complemento || "",
        codigoPostal: data.direccion?.codigoPostal || "",
        regionId: data.regionId || "",
        comunaId: data.comunaId || ""
      });
    });
  }, [usuarioId]);

  useEffect(() => {
    if (!formData.regionId) return;

    obtenerComunas().then(data => {
      const filtradas = data.filter(
        c => c.region?.id === Number(formData.regionId)
      );
      setComunas(filtradas);
    });
  }, [formData.regionId]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = async e => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: Number(formData.telefono)
    };

    try {
      await editarUsuario(usuarioId, payload);
      setMensaje("✅ Perfil actualizado correctamente");
    } catch {
      setMensaje("❌ Error al actualizar perfil");
    }
  };

  if (!usuario) return <p className={styles["perfil-loading"]}>Cargando...</p>;

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <h2 className="perfil-title">Mi Perfil</h2>

        <form className="perfil-form" onSubmit={guardarCambios}>
          <div className="perfil-grid">
            <div className="perfil-field">
              <label>Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange}/>
            </div>

            <div className="perfil-field">
              <label>Apellidos</label>
              <input name="apellidos" value={formData.apellidos} onChange={handleChange}/>
            </div>

            <div className="perfil-field">
              <label>Correo</label>
              <input value={usuario.correo} disabled />
            </div>

            <div className="perfil-field">
              <label>Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange}/>
            </div>
          </div>

          <h3 className="perfil-subtitle">Dirección</h3>

          <div className="perfil-grid">
            <div className="perfil-field">
              <label>Región</label>
              <select name="regionId" value={formData.regionId} onChange={handleChange}>
                <option value="">Seleccione región</option>
                {regiones.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>

            <div className="perfil-field">
              <label>Comuna</label>
              <select name="comunaId" value={formData.comunaId} onChange={handleChange}>
                <option value="">Seleccione comuna</option>
                {comunas.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="perfil-field">
              <label>Calle</label>
              <input name="calle" value={formData.calle} onChange={handleChange}/>
            </div>

            <div className="perfil-field">
              <label>Número</label>
              <input name="numero" value={formData.numero} onChange={handleChange}/>
            </div>

            <div className="perfil-field">
              <label>Complemento</label>
              <input name="complemento" value={formData.complemento} onChange={handleChange}/>
            </div>

            <div className="perfil-field">
              <label>Código Postal</label>
              <input name="codigoPostal" value={formData.codigoPostal} onChange={handleChange}/>
            </div>
          </div>

          <button className="perfil-btn" type="submit">
            Guardar cambios
          </button>

          {mensaje && <p className="perfil-msg">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}