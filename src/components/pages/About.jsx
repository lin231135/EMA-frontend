import { useState } from "react";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, Logo, AvatarDropdown, Footer } from '../layout'
import { TestimonialCard, RecitalCard } from '../ui'
import { translations } from '../../translations'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function About() {
  const [lang, setLang] = useState("es");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const t = translations[lang];

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
      participants: 25,
      image: "/RecitalDiciembre.jpg"
    },
    {
      date: lang === "es" ? "Enero 2025" : "January 2025",
      title: lang === "es" ? "Recital de Invierno" : "Winter Recital",
      description: lang === "es"
        ? "Recital especial de invierno con piezas clásicas y modernas"
        : "Special winter recital with classical and modern pieces",
      participants: 12,
      image: "/RecitalInicio.jpg"
    },
    {
      date: lang === "es" ? "Mayo 2024" : "May 2024",
      title: lang === "es" ? "Concierto de Primavera" : "Spring Concert",
      description: lang === "es"
        ? "Recital temático con música de diferentes épocas y estilos"
        : "Themed recital with music from different eras and styles",
      participants: 18,
      image: "/RecitalSpring.jpg"
    }
    
  ];
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

      <main className="min-h-screen flex-1">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat h-[500px] flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/Nosotros.jpg')" }}
        >
          <div className="bg-black/60 absolute inset-0"></div>
          <div className="relative z-10 text-center p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{lang === "es" ? "Nosotros" : "About Us"}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              {lang === "es" 
                ? "Conoce acerca de nuestra misión, visión y compromiso con la educación musical"
                : "Learn about our mission, vision, and commitment to music education."
              }
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-8 bg-gray-50 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">MISIÓN</h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">{t.missionText}</p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">VISIÓN</h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">{t.visionText}</p>
                </div>
              </div>

              {/* Commitment */}
              <div className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/4 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-800 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">COMPROMISO</h3>
                </div>
                <div className="pb-24">
                  <p className="leading-relaxed text-gray-600 text-center">{t.commitmentText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Career */}
        <section className="py-16 px-8 bg-blue-50 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-black text-3xl lg:text-4xl font-bold mb-6">{t.professionalCareer}</h2>
                <p className="text-lg leading-relaxed mb-8 text-gray-600">{t.careerText}</p>
                <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">20+</span>
                    <span className="text-sm text-gray-600">
                      {lang === "es" ? "Años de experiencia" : "Years of experience"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">100+</span>
                    <span className="text-sm text-gray-600">
                      {lang === "es" ? "Estudiantes formados" : "Students trained"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-slate-800">30+</span>
                    <span className="text-sm text-gray-600">
                      {lang === "es" ? "Recitales organizados" : "Recitals organized"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-72">
                <div className="h-96 w-full">
                  <img 
                    src="/teacher.jpg" 
                    alt="Teacher Elizabeth Delgado" 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recitals */}
        <section className="py-16 px-8 w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-slate-800 text-3xl lg:text-4xl font-bold mb-4">{t.recitals}</h2>
            <p className="text-center max-w-2xl mx-auto mb-12 text-lg text-gray-600 leading-relaxed font-bold">{t.recitalsText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recitalEvents.map((event, index) => (
                <RecitalCard key={index} recital={event} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-8 bg-blue-50 w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-slate-800 text-3xl lg:text-4xl font-bold mb-4">{t.testimonials}</h2>
            <p className="text-center max-w-2xl mx-auto mb-12 text-lg text-gray-600 leading-relaxed">{t.testimonialsText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
