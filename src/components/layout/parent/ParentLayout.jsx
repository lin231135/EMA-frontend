// src/components/layout/parent/ParentLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import ParentNavbar from "./ParentNavbar";

export default function ParentLayout({
  children,
  kidsFilter,      // { all, ...kidKeys }  (opcional)
  onToggleKid,     // (key) => void        (opcional)
  kidsLabels,      // { kid-<id>: name }   (opcional)
  parentName = "", // nombre del padre logueado (opcional)
  kidStyles = {},  // NUEVO: estilos por hijo { 'kid-<id>': { bar, ring, text, accent? } }
}) {
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : null;

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ema_parent_sb_collapsed") === "1";
    // Si nunca se guardó, Sidebar inicia expandido (false)
  });

  useEffect(() => {
    localStorage.setItem("ema_parent_sb_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const contentShift = collapsed ? "md:ml-20" : "md:ml-64";

  const logout = () => {
    try { auth?.logout?.(); } catch {}
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        kidsFilter={kidsFilter}
        onToggleKid={onToggleKid}
        kidsLabels={kidsLabels}
        kidStyles={kidStyles}  // <-- pasa los colores por hijo al sidebar
      />

      <div className={contentShift}>
        {/* Pasamos parentName al Navbar para que lo muestre */}
        <ParentNavbar onLogout={logout} parentName={parentName} />
      </div>

      <main className={`flex-1 min-w-0 ${contentShift} px-4 sm:px-6 pt-4 pb-8`}>
        {children}
      </main>
    </div>
  );
}