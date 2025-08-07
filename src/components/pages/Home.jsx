import { useState } from "react";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from '../layout'
import { translations } from '../../translations'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [lang, setLang] = useState("es");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

  // Funciones para manejar la autenticación
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

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <Navbar>
        <div className="flex items-center">
          <Logo />
        </div>
        <NavbarDivider />
        <NavbarSection>
          <NavbarItem href="/">{lang === "es" ? "Inicio" : "Home"}</NavbarItem>
          <NavbarItem href="/about">{lang === "es" ? "Nosotros" : "About"}</NavbarItem>
          <NavbarItem href="#content">{lang === "es" ? "Contenido" : "Services"}</NavbarItem>
          <NavbarItem href="#contact">{lang === "es" ? "Contacto" : "Contact"}</NavbarItem>
        </NavbarSection>
        <NavbarSection>
          <button 
            onClick={() => setLang(lang === "es" ? "en" : "es")} 
            className="text-gray-200 hover:text-white px-2 py-2 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base font-medium mr-2 sm:mr-4 transition-colors duration-200"
          >
            {t.langToggle}
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

      <main className="flex flex-col lg:flex-row justify-between items-center py-16 px-8 bg-gray-50 flex-1 max-w-7xl mx-auto w-full">
        <div className="max-w-lg lg:max-w-1/2 mb-8 lg:mb-0 w-full lg:w-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t.title}</h1>
          <h3 className="text-xl lg:text-2xl text-teal-700 mb-4">{t.subtitle}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{t.lorem}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-6 py-3 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors duration-200 cursor-pointer">
              {t.contact}
            </button>
            <button className="px-6 py-3 bg-white border border-teal-700 text-teal-700 rounded-md hover:bg-teal-50 transition-colors duration-200 cursor-pointer">
              {t.moreInfo}
            </button>
          </div>
          <div className="text-2xl space-x-4">
            <span>🌐</span> <span>📷</span> <span>🐦</span> <span>✉️</span>
          </div>
        </div>
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
          <div className="w-80 h-80 lg:w-96 lg:h-96">
            <img 
              src="/home.png" 
              alt="music" 
              className="w-full h-full object-contain rounded-lg shadow-lg"
              loading="eager"
            />
          </div>
        </div>
      </main>

      <section className="py-16 px-8 text-center flex-1 bg-white w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900">{t.features}:</h2>
          <div className="flex flex-col md:flex-row justify-center gap-12 max-w-4xl mx-auto">
            <div className="max-w-sm">
              <h4 className="text-xl font-semibold mb-4 text-teal-700">{t.packageA}</h4>
              <p className="text-gray-600 leading-relaxed">{t.lorem}</p>
            </div>
            <div className="max-w-sm">
              <h4 className="text-xl font-semibold mb-4 text-teal-700">{t.packageB}</h4>
              <p className="text-gray-600 leading-relaxed">{t.lorem}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}