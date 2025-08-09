import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from './index'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PageLayout({ children, className = "", lang, setLang, t }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Usuario cerró sesión');
  };

  // Función para determinar si el link está activo
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`font-sans text-gray-200 min-h-screen flex flex-col ${className}`}>
      <Navbar>
        <div className="flex items-center">
          <Logo />
        </div>
        <NavbarDivider />
        <NavbarSection>
          <NavbarItem 
            href="/" 
            className={isActiveLink('/') ? "text-teal-600" : ""}
          >
            {lang === "es" ? "Inicio" : "Home"}
          </NavbarItem>
          <NavbarItem 
            href="/about"
            className={isActiveLink('/about') ? "text-teal-600" : ""}
          >
            {lang === "es" ? "Nosotros" : "About"}
          </NavbarItem>
          <NavbarItem href="#content">{lang === "es" ? "Contenido" : "Services"}</NavbarItem>
          <NavbarItem 
            href="/contact"
            className={isActiveLink('/contact') ? "text-teal-600" : ""}
          >
            {lang === "es" ? "Contacto" : "Contact"}
          </NavbarItem>
        </NavbarSection>
        <NavbarSection>
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
        </NavbarSection>
      </Navbar>

      {children}

      <Footer lang={lang} />
    </div>
  );
}
