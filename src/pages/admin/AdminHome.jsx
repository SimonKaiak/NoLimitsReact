// Ruta: src/pages/admin/AdminHome.jsx

import "../../styles/adminHome.css"
import AdminLayout from "../../layouts/AdminLayout";

/**
 * AdminHome
 *
 * Esta es la página principal del panel de administración.
 * Su único propósito es mostrar un mensaje de bienvenida
 * y servir como punto de inicio desde donde el usuario puede navegar
 * hacia cualquiera de los módulos administrativos:
 *
 * - Catálogos (tipos de producto, géneros, estados, etc.)
 * - Usuarios
 * - Ventas
 * - Productos
 *
 * La página utiliza el layout AdminLayout, que contiene el menú superior
 * exclusivo del administrador.
 */
export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="admin-home">

        {/* Título principal del panel */}
        <h2>Panel de Administración</h2>

        {/* Texto informativo para guiar al administrador */}
        <p>Selecciona un módulo para gestionarlo.</p>

      </div>
    </AdminLayout>
  );
}
