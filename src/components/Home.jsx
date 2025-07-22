import { useState } from "react";
import "./Home.css";

const translations = {
  es: {
    title: "Clases de Música",
    subtitle: "Aprende el hermoso arte de la música",
    contact: "Contacto",
    moreInfo: "Más información",
    features: "Características",
    packageA: "Paquete A",
    packageB: "Paquete B",
    lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh.",
    langToggle: "EN",
  },
  en: {
    title: "Music Lesson",
    subtitle: "Learn the beautiful art of music",
    contact: "Contact",
    moreInfo: "More info",
    features: "Features",
    packageA: "Package A",
    packageB: "Package B",
    lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh.",
    langToggle: "ES",
  },
};

export default function Home() {
  const [lang, setLang] = useState("es");
  const t = translations[lang];

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">🎵 Logo</div>
        <nav>
          <a href="#home">{lang === "es" ? "Inicio" : "Home"}</a>
          <a href="#about">{lang === "es" ? "Nosotros" : "About Us"}</a>
          <a href="#content">{lang === "es" ? "Contenido" : "Content"}</a>
          <a href="#contact">{lang === "es" ? "Contacto" : "Contact"}</a>
        </nav>
        <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="lang-btn">
          {t.langToggle}
        </button>
      </header>

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
    </div>
  );
}