// src/components/layout/student/StudentLayout.jsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import { useAuth } from "../../../contexts/AuthContext";
import Sidebar from "./Sidebar";

function useBreadcrumbItems() {
  const { pathname } = useLocation();
  return useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((seg, i) => {
      const to = "/" + parts.slice(0, i + 1).join("/");
      const label = seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return { to, label };
    });
  }, [pathname]);
}

export default function StudentLayout({ children }) {
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : null;

  // colapso del sidebar
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ema_sb_collapsed") === "1";
  });

  useEffect(() => {
    localStorage.setItem("ema_sb_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const breadcrumbs = useBreadcrumbItems();
  const contentShift = collapsed ? "md:ml-20" : "md:ml-64";

  const logout = () => {
    try { auth?.logout?.(); } catch {}
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SIDEBAR fijo a la izquierda (sobre el navbar) */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(c => !c)} />

      {/* NAVBAR (debajo del sidebar) */}
      <div className={contentShift}>
        <StudentNavbar onLogout={logout} />
      </div>

      {/* CONTENIDO */}
      <main className={`flex-1 min-w-0 ${contentShift} px-4 sm:px-6 pt-4 pb-8`}>
        {children}
      </main>
    </div>
  );
}
