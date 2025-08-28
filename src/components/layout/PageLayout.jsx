
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Logo, Footer as AppFooter, AvatarDropdown } from './index';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PageLayout({ children, className = "", lang, setLang, t }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Usuario cerró sesión');
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className={`font-sans text-gray-200 min-h-screen flex flex-col ${className}`}>
      {/* Navbar Flowbite conservando la misma información */}
      <FlowbiteNavbar fluid rounded>
        <NavbarBrand href="/">
          <Logo size="h-18" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white ml-2">
          </span>
        </NavbarBrand>
        <div className="flex md:order-2 items-center">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-gray-200 hover:text-white px-2 py-2 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base font-medium mr-2 sm:mr-4 transition-colors duration-200"
          >
            {t?.langToggle || (lang === "es" ? "EN" : "ES")}
          </button>
          <AvatarDropdown
            isAuthenticated={isAuthenticated}
            user={user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            translations={t}
          />
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/" active={isActiveLink('/')}>{lang === "es" ? "Inicio" : "Home"}</NavbarLink>
          <NavbarLink href="/about" active={isActiveLink('/about')}>{lang === "es" ? "Nosotros" : "About"}</NavbarLink>
          <NavbarLink href="#content">{lang === "es" ? "Contenido" : "Services"}</NavbarLink>
          <NavbarLink href="/schedule" active={isActiveLink('/schedule')}>{t?.scheduleMenu ?? (lang === "es" ? "Horario" : "Schedule")}</NavbarLink>
          <NavbarLink href="/contact" active={isActiveLink('/contact')}>{lang === "es" ? "Contacto" : "Contact"}</NavbarLink>
        </NavbarCollapse>
      </FlowbiteNavbar>

      {/* Contenido principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer animado */}
      <AppFooter
        lang={lang}
        className="bg-gradient-to-r from-[#9931CC] to-[#038EFE] text-white rounded-none animate-gradient-x bg-[length:200%_200%]"
      />
    </div>
  );
}
