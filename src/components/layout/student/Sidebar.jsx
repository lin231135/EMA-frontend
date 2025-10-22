// src/components/layout/student/Sidebar.jsx
/**
 * @file Sidebar.jsx (Student)
 * @description Barra lateral de navegación para el rol estudiante
 * 
 * Características principales:
 * - Navegación colapsable/expandible
 * - Iconos SVG inline para cada sección
 * - Soporte para dark mode
 * - Logout con limpieza de autenticación
 * - Estilos adaptados al tema cyan de la aplicación
 * - Menú simplificado sin filtros (a diferencia del sidebar de padre)
 * 
 * @author EMA Frontend Team
 * @version 2.0.0
 */

import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Logo } from "../Logo";

/**
 * Genera las clases CSS para los enlaces de navegación
 * 
 * @param {boolean} isActive - Indica si el enlace está activo
 * @param {boolean} collapsed - Indica si el sidebar está colapsado
 * @returns {string} Clases CSS concatenadas
 */
const linkCls = (isActive, collapsed) =>
  [
    "flex items-center rounded-lg text-sm font-medium transition",
    "px-2 py-2",
    isActive
      ? "bg-cyan-500 text-white shadow-sm"
      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
    collapsed ? "justify-center" : "justify-start",
  ].join(" ");

/**
 * Elementos del menú de navegación para estudiantes
 * Array estático con rutas, labels e iconos
 * 
 * Nota: A diferencia del sidebar de padre, este no usa traducciones dinámicas
 */
const items = [
  { to: "/student/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/student/calendar", label: "Calendar", icon: "calendar" },
  { to: "/student/payment", label: "Payments", icon: "card" },
  { to: "/student/historyPayments", label: "Payment History", icon: "card" },
  { to: "/student/books", label: "Books", icon: "book" },
  { to: "/student/profile", label: "Profile", icon: "user" },
];

/**
 * Componente de icono SVG inline
 * 
 * Renderiza iconos SVG predefinidos basados en el nombre proporcionado
 * Iconos disponibles: grid, calendar, books, card, book, user
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del icono a renderizar
 * @returns {JSX.Element} Elemento SVG del icono
 */
function Icon({ name }) {
  // Mapa de paths SVG para cada icono
  const pathMap = {
    grid: "M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z",
    calendar:
      "M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z",
    books:
      "M5.005 10.19a1 1 0 0 1 1 1v.233l5.998 3.464L18 11.423v-.232a1 1 0 1 1 2 0V12a1 1 0 0 1-.5.866l-6.997 4.042a1 1 0 0 1-1 0l-6.998-4.042a1 1 0 0 1-.5-.866v-.81a1 1 0 0 1 1-1ZM5 15.15a1 1 0 0 1 1 1v.232l5.997 3.464 5.998-3.464v-.232a1 1 0 1 1 2 0v.81a1 1 0 0 1-.5.865l-6.998 4.042a1 1 0 0 1-1 0L4.5 17.824a1 1 0 0 1-.5-.866v-.81a1 1 0 0 1 1-1Z",
    card:
      "M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 6h16v6H4v-6Z M5 14a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm5 0a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z",
    book:
      "M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z",
    user:
      "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z",
  };

  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
      <path d={pathMap[name]} clipRule="evenodd" />
    </svg>
  );
}

/**
 * Componente principal del Sidebar del estudiante
 * 
 * Muestra navegación lateral con menú de opciones para estudiantes adultos.
 * Incluye:
 * - Logo y avatar del usuario
 * - Menú de navegación con iconos
 * - Indicador visual de página activa
 * - Botón de cerrar sesión
 * - Enlace a configuración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.collapsed - Estado de colapso del sidebar
 * @param {Function} props.onToggleCollapse - Callback para alternar colapso
 * @returns {JSX.Element} Componente Sidebar renderizado
 */
export default function Sidebar({ collapsed, onToggleCollapse }) {
  // Hooks de navegación y autenticación
  const navigate = useNavigate();
  const auth = useAuth?.();

  return (
    <aside
      className={[
        "hidden md:flex md:flex-col md:h-screen",
        "fixed top-0 left-0",
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        "transition-all duration-300 ease-in-out z-50",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      {/* ===== Header Section ===== */}
      {/* Logo y botón de toggle para colapsar el sidebar */}
      <div className={`flex items-center px-0 py-3 ${collapsed ? "flex-col justify-center" : "flex-row justify-between"}`}>
        {/* Logo con enlace al dashboard del estudiante */}
        <Link to="/student/dashboard" className="flex items-center justify-start gap-3">
          <Logo size="h-10" variant="color" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-cyan-600">Ellie's Music</div>
              <div className="text-xs text-gray-700 dark:text-gray-300 -mt-0.5">Academy</div>
            </div>
          )}
        </Link>
        {/* Botón para colapsar/expandir el sidebar */}
        <button
          onClick={onToggleCollapse}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mt-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6l6 6-6 6" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          )}
        </button>
      </div>

      {/* ===== Menu Navigation Section ===== */}
      {/* Lista de opciones de navegación del estudiante */}
      <nav className="px-3">
        <ul className="space-y-1 font-medium">
          {/* Itera sobre los items del menú definidos arriba */}
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                className={({ isActive }) => linkCls(isActive, collapsed)}
                title={collapsed ? it.label : undefined}
              >
                <span className="me-2 flex-shrink-0"><Icon name={it.icon} /></span>
                <span className={collapsed ? "hidden" : "ms-1 truncate"}>{it.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== Footer Section ===== */}
      {/* Sección inferior con configuración y cerrar sesión */}
      <div className="mt-auto px-3 pb-4 space-y-1 border-t border-gray-200 dark:border-gray-800">
        {/* Enlace a configuración */}
        <NavLink
          to="/student/settings"
          className={({ isActive }) => linkCls(isActive, collapsed)}
          title={collapsed ? "Settings" : undefined}
        >
          <span className="me-2 flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414Z" />
            </svg>
          </span>
          <span className={collapsed ? "hidden" : "ms-1 truncate"}>Settings</span>
        </NavLink>

        {/* Botón de cerrar sesión */}
        {/* Limpia la autenticación y redirige al login */}
        <button
          onClick={() => {
            try { auth?.logout?.(); } catch {}
            navigate("/login");
          }}
          className={linkCls(false, collapsed)}
          title={collapsed ? "Logout" : undefined}
        >
          <span className="me-2 flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
            </svg>
          </span>
          <span className={collapsed ? "hidden" : "ms-1 truncate"}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
