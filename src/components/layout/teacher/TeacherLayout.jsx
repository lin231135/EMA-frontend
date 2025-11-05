// src/components/layout/teacher/TeacherLayout.jsx
/**
 * @file TeacherLayout.jsx
 * @description Layout principal para el rol maestro
 * 
 * Características principales:
 * - Integra Sidebar colapsable y Navbar fijo
 * - Gestión de estado del sidebar (expandido/colapsado)
 * - Persistencia del estado en localStorage
 * - Breadcrumbs automáticos basados en la ruta
 * - Logout integrado con limpieza de autenticación
 * - Diseño responsivo con transiciones suaves
 * - Soporte para dark mode
 * 
 * Estructura del layout:
 * - Sidebar: Fijo a la izquierda, sobre el navbar
 * - Navbar: Sticky en la parte superior
 * - Main content: Área principal desplazada según estado del sidebar
 * 
 * @author EMA Frontend Team
 * @version 2.0.0
 */

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherNavbar from "./TeacherNavbar";
import { useAuth } from "../../../contexts/AuthContext";
import Sidebar from "./Sidebar";

/**
 * Hook personalizado para generar breadcrumbs
 * 
 * Genera automáticamente breadcrumbs basados en la ruta actual.
 * Convierte paths como "/teacher/calendar" en:
 * [{ to: "/teacher", label: "Teacher" }, { to: "/teacher/calendar", label: "Calendar" }]
 * 
 * @returns {Array<{to: string, label: string}>} Array de objetos breadcrumb
 */
function useBreadcrumbItems() {
  const { pathname } = useLocation();
  return useMemo(() => {
    // Separa el path en segmentos y filtra vacíos
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((seg, i) => {
      // Construye el path acumulativo para cada segmento
      const to = "/" + parts.slice(0, i + 1).join("/");
      // Capitaliza cada palabra del segmento para el label
      const label = seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return { to, label };
    });
  }, [pathname]);
}

/**
 * Componente principal del layout del maestro
 * 
 * Proporciona la estructura base para todas las páginas del rol maestro:
 * - Sidebar de navegación colapsable
 * - Navbar superior con controles de usuario
 * - Área de contenido principal con padding responsivo
 * - Gestión automática de breadcrumbs
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar en el área principal
 * @returns {JSX.Element} Layout completo del maestro
 */
export default function TeacherLayout({ children }) {
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : null;

  // ===== Estado del Sidebar =====
  // Gestiona si el sidebar está colapsado o expandido
  // Lee el estado inicial desde localStorage para persistencia
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ema_teacher_sb_collapsed") === "1";
  });

  // Guarda el estado del sidebar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("ema_teacher_sb_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Genera breadcrumbs automáticamente basados en la ruta
  const breadcrumbs = useBreadcrumbItems();
  
  // Calcula el margen izquierdo del contenido según el estado del sidebar
  const contentShift = collapsed ? "md:ml-20" : "md:ml-64";

  /**
   * Maneja el cierre de sesión
   * Intenta ejecutar logout del contexto de autenticación
   * y redirige al login independientemente del resultado
   */
  const logout = () => {
    try { 
      auth?.logout?.(); 
    } catch (error) {
      console.error("Error durante logout:", error);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ===== SIDEBAR ===== */}
      {/* Fijo a la izquierda, z-index más alto para estar sobre el navbar */}
      <Sidebar 
        collapsed={collapsed} 
        onToggleCollapse={() => setCollapsed(c => !c)} 
      />

      {/* ===== NAVBAR ===== */}
      {/* Sticky en la parte superior, desplazado según estado del sidebar */}
      <div className={contentShift}>
        <TeacherNavbar onLogout={logout} />
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      {/* Área principal de la aplicación donde se renderizan las páginas */}
      <main className={`flex-1 min-w-0 ${contentShift} px-4 sm:px-6 pt-4 pb-8`}>
        {children}
      </main>
    </div>
  );
}