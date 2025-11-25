// Ruta: src/layouts/AdminLayout.jsx

import AdminNavbar from "../components/atoms/AdminNavbar";

/**
 * AdminLayout
 *
 * Este layout define la estructura base de todas las páginas del panel
 * de administración. Su función es envolver las vistas del administrador
 * con un diseño común.
 *
 * El layout incluye:
 *  - La barra de navegación del administrador (AdminNavbar)
 *  - Un contenedor principal (<main>) donde se muestran las vistas
 *    que correspondan a cada ruta (children)
 *
 * Children:
 * Representa cualquier contenido interno que se pase dentro del layout.
 * Es decir, este layout envuelve las páginas del admin.
 */
export default function AdminLayout({ children }) {
  return (
    <div>

      {/*
        Barra superior del panel admin.
        Siempre estará visible en todas las páginas del administrador.
      */}
      <AdminNavbar />

      {/*
        Contenedor principal donde se insertan todas las pantallas
        del administrador, como:

          - Listado de productos
          - Crear tipo de producto
          - Listado de usuarios
          - Ventas
          - Catálogos

        Todo lo que se pase entre <AdminLayout> y </AdminLayout>
        se mostrará aquí.
      */}
      <main style={{ padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}
