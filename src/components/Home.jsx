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
      <nav className="bg-[#ffd700]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-0">
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <img src="/LogoNegroEMA2.svg" alt="EMA Logo" className="h-32 w-auto" />
              </a>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4 items-center">
                  <a href="#home" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">{lang === "es" ? "Inicio" : "Home"}</a>
                  <a href="#about" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">{lang === "es" ? "Nosotros" : "About"}</a>
                  <a href="#content" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">{lang === "es" ? "Contenido" : "Services"}</a>
                  <a href="#contact" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">{lang === "es" ? "Contacto" : "Contact"}</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                {t.langToggle}
              </button>
              <div className="md:hidden">
                <button className="text-gray-200 hover:text-white focus:outline-none">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

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