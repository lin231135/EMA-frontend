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
import translations from "../../translations";

export default function PageLayout({ children, className = "", hideUserMenu = false }) {
  const { isAuthenticated, user, logout, lang, setLang } = useAuth();
  const t = translations[lang].common;
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
      <FlowbiteNavbar fluid className="shadow-md">
        <NavbarBrand href="/">
          <Logo size="h-18" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white ml-2">
          </span>
        </NavbarBrand>
        <div className="flex md:order-2 items-center">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="bg-[#01A6CC] hover:bg-[#038EFE] text-white px-2 py-2 sm:px-3 sm:py-2 
             rounded-md text-sm sm:text-base font-medium mr-2 sm:mr-4 transition-colors duration-200"
          >
            {lang === "es" ? "ES" : "EN"}
          </button>
          {!hideUserMenu && (
            <AvatarDropdown
              isAuthenticated={isAuthenticated}
              user={user}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              translations={t}
            />
          )}
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/" className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/')}>{t.home}</NavbarLink>
          <NavbarLink href="/about" className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/about')}>{t.about}</NavbarLink>
          <NavbarLink href="#content" className={'text-gray-500 hover:!text-[#038EFE]'}>{t.services}</NavbarLink>
          <NavbarLink href="/contact" className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/contact')}>{t.contact}</NavbarLink>
        </NavbarCollapse>
      </FlowbiteNavbar>

      {/* Contenido principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer animado */}
      <AppFooter
        className="bg-gradient-to-r from-[#9931CC] to-[#038EFE] text-white animate-gradient-x bg-[length:200%_200%]"
      />
    </div>
  );
}
