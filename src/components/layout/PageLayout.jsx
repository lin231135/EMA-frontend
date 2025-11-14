import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Logo, Footer as AppFooter, AvatarDropdown } from './index';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import translations from "../../translations";
import * as Tone from "tone";

export default function PageLayout({ children, className = "", hideUserMenu = false }) {
  const { isAuthenticated, user, logout, lang, setLang } = useAuth();
  const t = translations[lang].common;
  const navigate = useNavigate();
  const location = useLocation();
  const synthRef = useRef(null);
  const samplerReadyRef = useRef(false);
  const initPromiseRef = useRef(null); // Promise para coordinar la inicialización
  const [audioInitialized, setAudioInitialized] = useState(false);

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Usuario cerró sesión');
  };

  const isActiveLink = (path) => location.pathname === path;

  //efecto notas musicales
  const initializeAudio = async () => {
    // Si ya hay una Promise de inicialización en proceso, retornarla
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    // Si ya está inicializado, no hacer nada
    if (audioInitialized && samplerReadyRef.current) {
      return Promise.resolve();
    }

    // Crear nueva Promise de inicialización
    initPromiseRef.current = (async () => {
      try {
        await Tone.start();
        console.log("✅ Audio context iniciado desde PageLayout");

        const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.25 }).toDestination();
        const comp = new Tone.Compressor({ threshold: -24, ratio: 3 }).connect(reverb);

        const sampler = new Tone.Sampler({
          urls: {
            C4: "C4.mp3",
            D4: "D4.mp3",
            E4: "E4.mp3",
            C5: "C5.mp3",
            D5: "D5.mp3",
            E5: "E5.mp3",
            F5: "F5.mp3",
          },
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          attack: 0.003,
          release: 1.2,
        });

        sampler.volume.value = -6;
        sampler.connect(comp);

        // Esperar explícitamente a que el sampler esté completamente cargado
        await sampler.loaded;
        
        // Asignar referencias solo después de que esté completamente listo
        synthRef.current = sampler;
        samplerReadyRef.current = true;
        setAudioInitialized(true);
        
        console.log("✅ Sampler del PageLayout cargado y listo");
      } catch (e) {
        console.error("❌ Error inicializando audio:", e);
        initPromiseRef.current = null; // Resetear en caso de error
        throw e;
      }
    })();

    return initPromiseRef.current;
  };

  const playNote = async (i) => {
    const notes = ["C5", "D5", "E5", "C4"];
    const note = notes[i % notes.length];

    // Si no está inicializado, inicializar y esperar
    if (!audioInitialized || !samplerReadyRef.current) {
      try {
        await initializeAudio();
        // Esperar un frame adicional para asegurar que todo esté listo
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.error("❌ Error inicializando para reproducir:", e);
        return;
      }
    }

    // Verificar que esté listo antes de reproducir
    if (!synthRef.current || !samplerReadyRef.current) {
      console.log("⏳ Sampler aún no está listo");
      return;
    }

    // Reproducir la nota
    try {
      synthRef.current.triggerAttackRelease(note, "8n", undefined, 0.7);
      console.log(`🎵 Nota reproducida: ${note}`);
    } catch (e) {
      console.error("❌ Error reproduciendo nota:", e);
    }
  };

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
          <NavbarLink as={Link} to="/" onClick={() => playNote(0)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/')}>{t.home}</NavbarLink>
          <NavbarLink as={Link} to="/about" onClick={() => playNote(1)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/about')}>{t.about}</NavbarLink>
          <NavbarLink as={Link} to="/service" onClick={() => playNote(2)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/service')}>{t.service}</NavbarLink>
          <NavbarLink as={Link} to="/contact" onClick={() => playNote(3)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/contact')}>{t.contact}</NavbarLink>
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
