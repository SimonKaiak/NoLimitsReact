// ✅ Ruta: src/pages/admin/AdminHome.jsx
import "../../styles/adminHome.css"
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="admin-home">
        <h2>Panel de Administración</h2>
        <p>Selecciona un módulo para gestionarlo.</p>
      </div>
    </AdminLayout>
  );
}