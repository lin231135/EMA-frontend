// src/components/pages/parent/ParentProfileSelect.jsx

/**
 * @fileoverview Página de selección de perfiles para usuarios padres.
 * Permite a un padre seleccionar entre su propio perfil o el perfil de cualquiera de sus hijos
 *  */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, Button, Spinner } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";
import { Logo } from "../../layout/Logo";

/**
 * Componente que muestra las iniciales de un nombre en un círculo.
 * Se utiliza como fallback cuando no hay imagen de avatar disponible.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.name] - Nombre completo del usuario 
 * @returns {JSX.Element} Círculo con las iniciales del nombre
 */
function CircleInitials({ name }) {
  // Memoriza las iniciales para evitar recalcular en cada render
  const initials = useMemo(() => {
    if (!name) return "EM"; 
    // Toma la primera letra de cada palabra, máximo 2 letras
    return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  }, [name]);

  return (
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-900 text-white flex items-center justify-center">
      <span className="text-xl md:text-2xl font-semibold">{initials}</span>
    </div>
  );
}

/**
 * Tarjeta interactiva que representa un perfil (padre o hijo).
 * Muestra el avatar o las iniciales del usuario, con efectos visuales
 * al pasar el mouse (halo de color, escalado).
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.profile - Datos del perfil a mostrar
 * @param {number} props.profile.id - ID único del perfil
 * @param {string} props.profile.name - Nombre completo del usuario
 * @param {string} [props.profile.avatarUrl] - URL de la imagen del avatar
 * @param {('parent'|'student')} props.profile.type - Tipo de perfil
 * @param {Function} props.onSelect - Callback al seleccionar el perfil
 * @param {string} props.parentSuffix - Texto a agregar si es perfil de padre (ej: " (Padre)")
 * @returns {JSX.Element} Tarjeta de perfil interactiva
 * 
 */
function ProfileCard({ profile, onSelect, parentSuffix }) {
  const alt = profile?.name || "Perfil";
  const avatarSrc = profile?.avatarUrl || "";

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      className="group flex flex-col items-center gap-3 focus:outline-none"
      aria-label={alt}
      title={alt}
    >
      {/* Círculo con efecto de halo de color al hover */}
      <div className="relative">
        {/* Halo de gradiente (visible solo al hover) */}
        <div className="rounded-full p-1 bg-gradient-to-br from-fuchsia-500/60 via-cyan-400/60 to-blue-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
        <div className="absolute inset-0 rounded-full -z-10" />
        
        {/* Contenedor del avatar con efectos de transición */}
        <div className="rounded-full ring-1 ring-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95 overflow-hidden w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-gray-900">
          {/* Muestra avatar si hay URL, de lo contrario muestra iniciales */}
          {avatarSrc ? <Avatar img={avatarSrc} rounded alt={alt} /> : <CircleInitials name={profile?.name} />}
        </div>
      </div>

      {/* Nombre del perfil con sufijo opcional para padres */}
      <span className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 text-center max-w-[20ch]">
        {profile?.name}
        {profile?.type === "parent" ? parentSuffix : ""}
      </span>
    </button>
  );
}

/* =======================
   COMPONENTE PRINCIPAL
   ======================= */

/**
 * Página de selección de perfiles para usuarios padres.
 * 
 * Permite al padre elegir entre ver su propio dashboard o acceder al dashboard
 * de cualquiera de sus hijos. La página realiza las siguientes operaciones:
 * 
 * 1. Carga los perfiles disponibles desde el backend (/api/parents/profiles)
 * 2. Muestra el perfil del padre y los perfiles de todos los hijos
 * 3. Al seleccionar el perfil del padre: navega a /parent/dashboard
 * 4. Al seleccionar un hijo: establece el estudiante activo y navega a /student/dashboard/:id
 * 
 */
export default function ParentProfileSelect() {
  const navigate = useNavigate();
  const { token, lang, user, setActiveStudent, authFetch } = useAuth() || {};

  // Obtener traducciones para el idioma actual
  const t = translations[lang].profiles;

  /* ==================
     ESTADO DEL COMPONENTE
     ================== */
  const [parentProfile, setParentProfile] = useState(null);        // Perfil del padre
  const [childrenProfiles, setChildrenProfiles] = useState([]);     // Array de perfiles de hijos
  const [loading, setLoading] = useState(true);                     // Indicador de carga
  const [errMsg, setErrMsg] = useState("");                         // Mensaje de error

  /* ==================
     EFECTOS
     ================== */

  /**
   * Efecto: Carga los perfiles desde el backend al montar el componente.
   * 
   * Realiza una petición GET a /api/parents/profiles que debe retornar:
   * {
   *   parent: { id, name, avatarUrl, ... },
   *   children: [{ id, name, avatarUrl, ... }, ...]
   * }
   * 
   * Los perfiles se normalizan agregando la propiedad 'type' para identificar
   * si es 'parent' o 'student'.
   */
  useEffect(() => {
    let alive = true; // Flag para prevenir actualizaciones de estado si el componente se desmonta
    
    async function load() {
      try {
        setLoading(true);
        setErrMsg("");
        
        // Construir URL base desde variable de entorno
        const base = (import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000/api");
        
        // Petición autenticada al endpoint de perfiles
        const res = await authFetch(`${base}/parents/profiles`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        if (!alive) return; // Salir si el componente ya se desmontó

        // Normalizar estructuras: agregar propiedad 'type' a cada perfil
        const parent = data?.parent ? { ...data.parent, type: "parent" } : null;
        const kids = Array.isArray(data?.children) 
          ? data.children.map(k => ({ ...k, type: "student" })) 
          : [];

        setParentProfile(parent);
        setChildrenProfiles(kids);
      } catch (e) {
        setErrMsg(e?.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    }
    
    load();
    return () => { alive = false; }; // Cleanup: marcar como desmontado
  }, [authFetch, token]);

  /**
   * Manejador: Selección del perfil del padre.
   * Limpia el estudiante activo y navega al dashboard del padre.
   */
  const handleSelectParent = () => {
    setActiveStudent(null); // Limpia cualquier estudiante activo
    navigate("/parent/dashboard", { state: { from: "profile-select" } });
  };

  /**
   * Manejador: Selección del perfil de un hijo.
   * Establece el hijo como estudiante activo y navega a su dashboard.
   * 
   * @param {Object} child - Datos del hijo seleccionado
   * @param {number} child.id - ID del estudiante
   * @param {string} child.name - Nombre del estudiante
   */
  const handleSelectChild = (child) => {
    setActiveStudent({ id: child.id, name: child.name });
    navigate(`/student/dashboard/${child.id}`, {
      state: { student: child, from: "profile-select" },
    });
  };

  /**
   * Array de perfiles para renderizar en fila.
   * El perfil del padre se muestra primero, seguido de los hijos.
   * Cada perfil incluye su callback onClick correspondiente.
   */
  const profilesRow = [
    // Incluir perfil del padre si existe
    ...(parentProfile ? [ { ...parentProfile, onClick: handleSelectParent } ] : []),
    // Agregar todos los perfiles de hijos
    ...childrenProfiles.map(c => ({ ...c, onClick: () => handleSelectChild(c) })),
  ];

  return (
    // Contenedor de pantalla completa sin navbar/footer para una UI más limpia
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-x-hidden">
      
      {/* Logo y nombre de la academia en la esquina superior izquierda */}
      <div className="absolute left-4 top-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="h-16 md:h-20" variant="color" />
          <div className="leading-tight hidden sm:block">
            <div className="text-base md:text-lg font-semibold text-cyan-600">Ellie’s Music</div>
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 -mt-0.5">Academy</div>
          </div>
        </Link>
      </div>

      {/* Contenedor principal centrado con títulos y perfiles */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-25 flex flex-col items-center">
        
        {/* Encabezado: Título principal y subtítulo */}
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t.subtitle}
            {user?.name ? ` — ${user.name}` : ""}
          </p>
        </header>

        {/* Contenido condicional basado en el estado */}
        
        {/* ESTADO: Cargando */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="xl" />
          </div>
        
        /* ESTADO: Error */
        ) : errMsg ? (
          <div className="max-w-xl mx-auto text-center space-y-4">
            <p className="text-red-600 dark:text-red-400 font-medium">{errMsg}</p>
            <Button onClick={() => location.reload()}>{t.retry}</Button>
          </div>
        
        /* ESTADO: Perfiles disponibles */
        ) : profilesRow.length > 0 ? (
          <div className="w-full flex flex-wrap items-start justify-center gap-x-10 gap-y-10">
            {profilesRow.map((p) => (
              <ProfileCard
                key={`${p.type}-${p.id}`}
                profile={p}
                onSelect={p.onClick}
                parentSuffix={t.parentSuffix}
              />
            ))}
          </div>
        
        /* ESTADO: Sin perfiles (lista vacía) */
        ) : (
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t.emptyTitle}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{t.emptyText}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => navigate("/parent/manage/students")} pill>
                {t.manage}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
