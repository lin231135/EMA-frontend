// src/components/layout/student/StudentNavbar.jsx

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "../../ui/Dropdown";
import { useAuth } from "../../../contexts/AuthContext";
import { HiGlobeAlt } from "react-icons/hi";
import translations from "../../../translations";

export default function StudentNavbar() {
  const { lang, setLang, user } = useAuth(); 
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = translations[lang]?.studentNavbar || translations.es.studentNavbar;

  // Diccionario simple de idiomas
  const languages = {
    en: { label: t.language.english, flag: "🇬🇧" },
    es: { label: t.language.spanish, flag: "🇪🇸" },
  };

  const safe = languages[lang] ?? languages.en;

  const handleSelectLang = (code) => {
    setLang(code);
    setIsLangMenuOpen(false);
  };

  const profileImage = user?.profile_image || null;
  const userName = user?.name || t.student;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-end gap-3">
        {/* Notificaciones */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={t.notifications}
          title={t.notifications}
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

        <Dropdown isOpen={isLangMenuOpen} onClose={() => setIsLangMenuOpen(false)}>
          <DropdownButton
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <HiGlobeAlt className="w-5 h-5" />
            <span className="text-sm">{safe.flag}</span>
          </DropdownButton>
          <DropdownMenu isOpen={isLangMenuOpen}>
            <DropdownItem onClick={() => handleSelectLang("en")}>
              🇬🇧 {t.language.english}
            </DropdownItem>
            <DropdownItem onClick={() => handleSelectLang("es")}>
              🇪🇸 {t.language.spanish}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Perfil - CON FOTO */}
        <NavLink
          to="/profile"
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
              {t.student}
            </span>
          </div>
        </NavLink>
      </div>
    </header>
  );
}