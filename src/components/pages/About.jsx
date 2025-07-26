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

  const testimonials = [
    {
      name: "María González",
      text: lang === "es" 
        ? "Las clases con la maestra Elena han sido transformadoras. Mi hija ha desarrollado no solo habilidades musicales, sino también disciplina y confianza en sí misma."
        : "The classes with teacher Elena have been transformative. My daughter has developed not only musical skills, but also discipline and self-confidence.",
      rating: 5,
      role: lang === "es" ? "Madre de estudiante" : "Student's mother"
    },
    {
      name: "Carlos Rodríguez",
      text: lang === "es"
        ? "Excelente metodología y paciencia. He aprendido más en 6 meses aquí que en años anteriores con otros profesores."
        : "Excellent methodology and patience. I have learned more in 6 months here than in previous years with other teachers.",
      rating: 5,
      role: lang === "es" ? "Estudiante adulto" : "Adult student"
    },
    {
      name: "Ana Martínez",
      text: lang === "es"
        ? "Los recitales han sido una experiencia increíble. Ver el progreso de mi hijo y su emoción al tocar en público no tiene precio."
        : "The recitals have been an incredible experience. Seeing my son's progress and his excitement playing in public is priceless.",
      rating: 5,
      role: lang === "es" ? "Madre de estudiante" : "Student's mother"
    }
  ];

  const recitalEvents = [
    {
      date: lang === "es" ? "Diciembre 2024" : "December 2024",
      title: lang === "es" ? "Recital de Fin de Año" : "End of Year Recital",
      description: lang === "es" 
        ? "Presentación de todos los estudiantes con piezas clásicas y contemporáneas"
        : "Performance by all students with classical and contemporary pieces",
      participants: 25
    },
    {
      date: lang === "es" ? "Junio 2024" : "June 2024",
      title: lang === "es" ? "Concierto de Primavera" : "Spring Concert",
      description: lang === "es"
        ? "Recital temático con música de diferentes épocas y estilos"
        : "Themed recital with music from different eras and styles",
      participants: 18
    },
    {
      date: lang === "es" ? "Marzo 2024" : "March 2024",
      title: lang === "es" ? "Festival de Talentos" : "Talent Festival",
      description: lang === "es"
        ? "Competencia amistosa entre estudiantes de diferentes niveles"
        : "Friendly competition between students of different levels",
      participants: 12
    }
  ];

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
        <section className="about-hero">
          <div className="hero-content">
            <h1>{lang === "es" ? "Nosotros" : "About Us"}</h1>
            <p className="hero-subtitle">
              {lang === "es" 
                ? "Conoce nuestra historia, valores y compromiso con la educación musical"
                : "Learn about our history, values and commitment to music education"
              }
            </p>
          </div>
        </section>

        {/* Mission, Vision, Commitment */}
        <section className="values-section">
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>{t.mission}</h3>
              <p>{t.missionText}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👁️</div>
              <h3>{t.vision}</h3>
              <p>{t.visionText}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>{t.commitment}</h3>
              <p>{t.commitmentText}</p>
            </div>
          </div>
        </section>

        {/* Professional Career */}
        <section className="career-section">
          <div className="career-content">
            <div className="career-text">
              <h2>{t.professionalCareer}</h2>
              <p>{t.careerText}</p>
              <div className="achievements">
                <div className="achievement">
                  <span className="achievement-number">10+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Años de experiencia" : "Years of experience"}
                  </span>
                </div>
                <div className="achievement">
                  <span className="achievement-number">200+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Estudiantes formados" : "Students trained"}
                  </span>
                </div>
                <div className="achievement">
                  <span className="achievement-number">50+</span>
                  <span className="achievement-text">
                    {lang === "es" ? "Recitales organizados" : "Recitals organized"}
                  </span>
                </div>
              </div>
            </div>
            <div className="career-image">
                <img src="public/teacher.jpg" alt="Teacher Elizabeth Delgado" />
            </div>
          </div>
        </section>

        {/* Recitals */}
        <section className="recitals-section">
          <h2>{t.recitals}</h2>
          <p className="section-description">{t.recitalsText}</p>
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
