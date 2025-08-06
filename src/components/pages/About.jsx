import { useState } from "react";
import "./About.css";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from '../layout'
import { TestimonialCard, RecitalCard } from '../ui'
import { translations } from '../../translations'

export default function About() {
  const [lang, setLang] = useState("es");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const t = translations[lang];

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log('Usuario cerró sesión');
  };

  return (
    <div className="about-container">
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

      <main className="about-main">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat h-[500px] flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/Nosotros.jpg')" }}
        >
          <div className="bg-black/60 absolute inset-0"></div> {/* overlay oscuro opcional */}
          <div className="relative z-10 text-center p-8 text-6xl font-bold">
            <h1>{lang === "es" ? "Nosotros" : "About Us"}</h1>
            <p className="hero-subtitle">
              {lang === "es" 
                ? "Conoce acerca de nuestra misión, visión y compromiso con la educación musical"
                : "Learn about our mission, vision, and commitment to music education."
              }
            </p>
          </div>
        </section>


        {/* Mision*/}
        <section className="values-section">
          <div className="values-grid">
              <div className="value-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-[8px] bg-[#01A6CC] "></div>
                <div className="absolute bottom-0 left-0 w-full h-[80px] bg-[#011C33] flex items-center justify-center">
                   <h3 className="text-white text-2xl font-bold">MISIÓN</h3>
                </div>
                <h3>{t.mission}</h3>
                <p>{t.missionText}</p>
              </div>

              {/* Vision*/}
              <div className="value-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-[8px] bg-[#01A6CC] "></div>
                <div className="absolute bottom-0 left-0 w-full h-[80px] bg-[#011C33] flex items-center justify-center">
                   <h3 className="text-white text-2xl font-bold">VISIÓN</h3>
                </div>
                <h3>{t.vision}</h3>
                <p>{t.visionText}</p>
              </div>

              {/*Compromiso*/}
              <div className="value-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-[8px] bg-[#01A6CC] "></div>
                <div className="absolute bottom-0 left-0 w-full h-[80px] bg-[#011C33] flex items-center justify-center">
                   <h3 className="text-white text-2xl font-bold">COMPROMISO</h3>
                </div>
                <h3>{t.commitment}</h3>
                <p>{t.commitmentText}</p>
              </div>
          </div>
        </section>

        {/* Professional Career */}
        <section className="career-section ">
          <div className="career-content">
            <div className="career-text text-2xl font-bold">
              <h2>{t.professionalCareer}</h2>
              <p>{t.careerText}</p>
              <div className="achievements">
                <div className="achievement">
                  <span className="achievement-number">20+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Años de experiencia" : "Years of experience"}
                  </span>
                </div>
                <div className="achievement">
                  <span className="achievement-number">100+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Estudiantes formados" : "Students trained"}
                  </span>
                </div>
                <div className="achievement">
                  <span className="achievement-number">30+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Recitales organizados" : "Recitals organized"}
                  </span>
                </div>
              </div>
            </div>
            <div className="value-card size-1/4 ">
              <div className="career-image">
                <img src="/teacher.jpg" alt="Teacher Elizabeth Delgado" />
              </div>
            </div>
            
          </div>
        </section>

        {/* Recitals */}
        <section className="recitals-section">
          <h2>{t.recitals}</h2>
          <p className="section-description font-bold">{t.recitalsText}</p>
          <div className="recitals-grid">
            {recitalEvents.map((event, index) => (
              <RecitalCard key={index} recital={event} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <h2>{t.testimonials}</h2>
          <p className="section-description">{t.testimonialsText}</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
