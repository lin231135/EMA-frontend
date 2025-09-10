
import { NavLink } from "react-router-dom";
import { Dropdown, DropdownItem, Avatar } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";

export default function StudentNavbar({ onLogout }) {
  const { lang, setLang } = useAuth();

  // Diccionario simple de idiomas
  const languages = {
    en: { label: "English", flag: "🇬🇧" },
    es: { label: "Español", flag: "🇪🇸" },
  };

  const safe = languages[lang] ?? languages.en;

  const handleSelectLang = (code) => {
    setLang(code);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-end gap-3">
        {/* Notificaciones */}
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

        {/* Idioma */}
        <Dropdown
          inline
          placement="bottom"
          label={`${safe.label} ${safe.flag}`}
        >
          <DropdownItem onClick={() => handleSelectLang("en")}>
            English
          </DropdownItem>
          <DropdownItem onClick={() => handleSelectLang("es")}>
            Español
          </DropdownItem>
        </Dropdown>

        {/* Perfil */}
        <NavLink
          to="/profile"
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1"
        >
          <Avatar img="https://i.pravatar.cc/64?img=21" rounded />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Moni Roy
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Admin
            </span>
          </div>
        </NavLink>

        {/* Logout */}
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
