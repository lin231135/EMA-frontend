import { useState } from "react";
import "./Home.css";
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
    <div className="home-container">
      <Navbar>
        <a href="#" className="flex items-center">
          <Logo />
        </a>
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

      <main className="hero">
        <div className="left">
          <h1>{t.title}</h1>
          <h3>{t.subtitle}</h3>
          <p>{t.lorem}</p>
          <div className="btn-group">
            <button>{t.contact}</button>
            <button className="outlined">{t.moreInfo}</button>
          </div>
          <div className="socials">
            <span>🌐</span> <span>📷</span> <span>🐦</span> <span>✉️</span>
          </div>
        </div>
        <div className="right">
          <img src="/home.png" alt="music" />
        </div>
      </main>

      <section className="features">
        <h2>{t.features}:</h2>
        <div className="packages">
          <div>
            <h4>{t.packageA}</h4>
            <p>{t.lorem}</p>
          </div>
          <div>
            <h4>{t.packageB}</h4>
            <p>{t.lorem}</p>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}