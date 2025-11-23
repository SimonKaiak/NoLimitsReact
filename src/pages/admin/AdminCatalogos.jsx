import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { ButtonAction } from "../../components/atoms/ButtonAction";
import "../../styles/adminCatalogos.css";

export default function AdminCatalogos() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h2 className="catalogos-title">Catálogos del Sistema</h2>
      <p className="catalogos-sub">Selecciona un catálogo para gestionarlo.</p>

      <div className="catalogos-grid">

        <ButtonAction text="Tipos de Producto" onClick={() => navigate("/admin/tipos-producto")} />
        <ButtonAction text="Clasificaciones" onClick={() => navigate("/admin/clasificaciones")} />
        <ButtonAction text="Estados" onClick={() => navigate("/admin/estados")} />
        <ButtonAction text="Géneros" onClick={() => navigate("/admin/generos")} />
        <ButtonAction text="Plataformas" onClick={() => navigate("/admin/plataformas")} />
        <ButtonAction text="Empresas" onClick={() => navigate("/admin/empresas")} />
        <ButtonAction text="Desarrolladores" onClick={() => navigate("/admin/desarrolladores")} />
        <ButtonAction text="Métodos de Pago" onClick={() => navigate("/admin/metodos-pago")} />
        <ButtonAction text="Métodos de Envío" onClick={() => navigate("/admin/metodos-envio")} />
        <ButtonAction text="Tipos de Empresa" onClick={() => navigate("/admin/tipos-empresa")} />
        <ButtonAction text="Tipos de Desarrollador" onClick={() => navigate("/admin/tipos-desarrollador")} />  
      </div>
    </AdminLayout>
  );
}
