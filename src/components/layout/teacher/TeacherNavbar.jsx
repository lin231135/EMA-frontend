// src/components/layout/teacher/TeacherNavbar.jsx
/**
 * @file TeacherNavbar.jsx
 * @description Barra de navegación superior para el rol maestro
 * 
 * Características principales:
 * - Selector de idioma
 * - Notificaciones
 * - Avatar y perfil del usuario
 * - Botón de logout
 * - Diseño responsivo con soporte dark mode
 * - Integración con contexto de autenticación
 * 
 * @author EMA Frontend Team
 * @version 2.0.0
 */

import { NavLink } from "react-router-dom";
import { Dropdown, Avatar } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import { HiGlobeAlt } from "react-icons/hi";

/**
 * Componente principal de la barra de navegación del maestro
 * 
 * Muestra controles de usuario en la parte superior de la aplicación:
 * - Selector de idioma con iconos de banderas
 * - Botón de notificaciones
 * - Avatar del usuario con enlace a perfil
 * - Botón de cierre de sesión
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onLogout - Callback para manejar el cierre de sesión
 * @returns {JSX.Element} Componente TeacherNavbar renderizado
 */
export default function TeacherNavbar({ onLogout }) {
  // Obtiene datos de autenticación: idioma, usuario y función para cambiar idioma
  const { lang, setLang, user } = useAuth(); 

  // Diccionario de idiomas disponibles con labels y banderas
  const languages = {
    en: { label: "English", flag: "🇬🇧" },
    es: { label: "Español", flag: "🇪🇸" },
  };

  // Idioma seguro: usa el idioma actual o inglés por defecto
  const safe = languages[lang] ?? languages.en;

  /**
   * Maneja el cambio de idioma
   * @param {string} code - Código del idioma (en, es, etc.)
   */
  const handleSelectLang = (code) => {
    setLang(code);
  };

  // Extrae información del usuario con valores por defecto
  const profileImage = user?.profile_image || null;
  const userName = user?.name || "Teacher";

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-end gap-3">
        {/* ===== Botón de Notificaciones ===== */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" />
            <path d="M10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* ===== Selector de Idioma ===== */}
        <Dropdown
          inline
          label={
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
              <HiGlobeAlt className="w-5 h-5" />
              <span className="text-sm">{safe.flag}</span>
            </div>
          }
          arrowIcon={false}
        >
          <Dropdown.Item onClick={() => handleSelectLang("en")}>
            🇬🇧 English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSelectLang("es")}>
            🇪🇸 Español
          </Dropdown.Item>
        </Dropdown>

        {/* ===== Perfil del Usuario ===== */}
        {/* Enlace al perfil del maestro con avatar y nombre */}
        <NavLink
          to="/teacher/profile"
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1"
        >
          <Avatar 
            img={profileImage || undefined}
            rounded 
            alt={userName}
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {userName}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Teacher
            </span>
          </div>
        </NavLink>

        {/* ===== Botón de Logout ===== */}
        <button
          onClick={onLogout}
          className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}