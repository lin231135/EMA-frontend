import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Logo, Footer as AppFooter, AvatarDropdown } from './index';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useRef } from "react";
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

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');
  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Usuario cerró sesión');
  };

  const isActiveLink = (path) => location.pathname === path;

  //efecto notas musicales
  const ensureSampler = async () => {
    if (samplerReadyRef.current && synthRef.current) return;
    await Tone.start();

    const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.25 }).toDestination();
    const comp = new Tone.Compressor({ threshold: -24, ratio: 3 }).connect(reverb);

    const sampler = new Tone.Sampler({
      urls: {
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      attack: 0.003,
      release: 1.2,
    }).connect(comp);

    sampler.volume.value = -6;
    await sampler.loaded;
    synthRef.current = sampler;
    samplerReadyRef.current = true;
  };

  useEffect(() => {
    const onUserGesture = () => {
      ensureSampler();
      window.removeEventListener("pointerdown", onUserGesture);
    };
    window.addEventListener("pointerdown", onUserGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onUserGesture);
  }, []);

  const playCourseNote = async (i) => {
    await ensureSampler();
    const notes = ["C5", "D5", "E5", "F5"];
    const note = notes[i % notes.length]; // <-- corregido (antes usabas index)
    synthRef.current.triggerAttackRelease(note, 0.25);
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
          <NavbarLink as={Link} to="/" onClick={() => playCourseNote(0)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/')}>{t.home}</NavbarLink>
          <NavbarLink as={Link} to="/about" onClick={() => playCourseNote(1)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/about')}>{t.about}</NavbarLink>
          <NavbarLink as={Link} to="/service" onClick={() => playCourseNote(2)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/service')}>{t.service}</NavbarLink>
          <NavbarLink as={Link} to="/contact" onClick={() => playCourseNote(3)} className={'text-gray-500 hover:!text-[#038EFE]'} active={isActiveLink('/contact')}>{t.contact}</NavbarLink>
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
