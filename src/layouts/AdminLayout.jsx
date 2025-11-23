// ✅ Ruta: src/layouts/AdminLayout.jsx
import AdminNavbar from "../components/atoms/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      <main style={{ padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}