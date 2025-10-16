// src/contexts/AuthContext.jsx

/**
 * Este contexto gestiona toda la lógica de autenticación incluyendo:
 * - Login/Logout de usuarios
 * - Persistencia de sesión (localStorage/sessionStorage)
 * - Renovación automática de tokens JWT
 * - Gestión de perfil activo (padre viendo como hijo)
 * - Internacionalización (idioma)
 * - Peticiones HTTP autenticadas con retry automático
 */

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/* =======================
   CONTEXTO Y HOOKS
   ======================= */

/**
 * Contexto de autenticación.
 * Proporciona estado y funciones relacionadas con autenticación a toda la app.
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * 
 * @returns {Object} Objeto con estado y funciones de autenticación
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

/**
 * URL base del API, obtenida de variables de entorno.
 * Se elimina cualquier slash final para evitar URLs duplicadas.
 */
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

/**
 * Decodifica un token JWT y extrae su payload.
 * 
 * @param {string} token - Token JWT en formato "header.payload.signature"
 * @returns {Object|null} Payload decodificado o null si el token es inválido
 * 
 */
function parseJwt(token) {
  try {
    // Extrae la segunda parte del JWT (payload, en base64)
    const base64 = token.split(".")[1];
    // Decodifica y parsea el JSON
    const payload = JSON.parse(atob(base64));
    return payload || null;
  } catch { 
    return null; 
  }
}

/**
 * Proveedor del contexto de autenticación.
 * Gestiona todo el estado relacionado con autenticación y proporciona
 * funciones para login, logout, refresh de tokens, etc.
 */
export const AuthProvider = ({ children }) => {
  
  /* ==================
     ESTADO DE AUTENTICACIÓN
     ================== */
  
  /**
   * Indica si el usuario está autenticado.
   * @type {boolean}
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  /**
   * Información del usuario autenticado.
   * @type {Object|null} Objeto con { id, name, email, role, ... }
   */
  const [user, setUser] = useState(null);
  
  /**
   * Token JWT de autenticación.
   * @type {string|null}
   */
  const [token, setToken] = useState(null);
  
  /**
   * Indica si se está verificando el estado de autenticación inicial.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /* ==================
     ESTADO DE INTERNACIONALIZACIÓN
     ================== */
  
  /**
   * Idioma actual de la aplicación ('es' o 'en').
   * Se persiste en localStorage.
   * @type {string}
   */
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");

  /* ==================
     ESTADO DE PERFIL ACTIVO
     ================== */
  
  /**
   * Estudiante activo cuando un padre accede como hijo.
   * @type {Object|null} Objeto con { id, name } o null si se accede como padre
   */
  const [activeStudent, setActiveStudent] = useState(null);

  /**
   * Referencia al timer de renovación automática de token.
   * @type {React.MutableRefObject<number|null>}
   */
  const refreshTimerRef = useRef(null);

  /* ==================
     EFECTOS DE INICIALIZACIÓN
     ================== */
  
  // Verifica el estado de autenticación al montar el componente
  useEffect(() => { checkAuthStatus(); }, []);
  
  // Persiste el idioma seleccionado en localStorage
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);

  /* ==================
     FUNCIONES DE SESIÓN
     ================== */

  /**
   * Verifica si hay una sesión guardada en localStorage o sessionStorage
   * y restaura el estado de autenticación si es válida.
   * 
   * Esta función se ejecuta automáticamente al cargar la aplicación.
   */
  const checkAuthStatus = () => {
    try {
      // Busca token y usuario en ambos storages (preferencia: localStorage)
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser  = localStorage.getItem("user")  || sessionStorage.getItem("user");

      if (storedToken && storedUser) {
        const u = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(u);
        setIsAuthenticated(true);
        scheduleRefresh(storedToken); // Programa renovación automática del token
      }
    } catch (e) {
      console.error("Error checking auth status:", e);
      logout(); // Si hay error, limpia la sesión
    } finally {
      setLoading(false); // Termina la carga inicial
    }
  };

  /**
   * Autentica un usuario con email y contraseña.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {boolean} [rememberMe=false] - Si true, guarda en localStorage; si false, en sessionStorage
   * @returns {Promise<Object>} Objeto con { ok: boolean, data?: Object, error?: string }
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      // Realiza petición de login al backend
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.message || "Error de autenticación");

      // Guarda en localStorage (persistente) o sessionStorage (temporal)
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      // Actualiza el estado de la aplicación
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setActiveStudent(null); // Limpia cualquier estudiante activo previo
      setLoading(false);

      // Programa la renovación automática del token
      scheduleRefresh(data.token);
      
      return { ok: true, data };
    } catch (err) {
      console.error("Login error:", err);
      return { ok: false, error: err.message };
    }
  };

  /**
   * Cierra la sesión del usuario actual.
   * Limpia todos los datos de autenticación del estado y del storage,
   * y cancela cualquier renovación de token programada.
   */
  const logout = () => {
    // Limpia datos de ambos storages
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Resetea el estado de autenticación
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setActiveStudent(null);

    // Cancela el timer de renovación automática
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  /* ==================
     RENOVACIÓN AUTOMÁTICA DE TOKENS
     ================== */

  /**
   * Programa la renovación automática del token JWT.
   * 
   * Calcula cuándo expira el token y programa una renovación automática
   * 60 segundos antes de la expiración (mínimo 5 segundos).
   */
  const scheduleRefresh = (jwt) => {
    if (!jwt) return;
    
    // Extrae información de expiración del token
    const payload = parseJwt(jwt);
    if (!payload?.exp) return;

    // Calcula tiempo (en milisegundos) hasta que expire el token
    const msToExpire = payload.exp * 1000 - Date.now();
    
    // Renueva 60 segundos antes de expirar (mínimo 5 segundos)
    const leeway = 60_000; // 60 segundos
    const due = Math.max(msToExpire - leeway, 5_000);

    // Cancela cualquier renovación previa programada
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    // Programa la renovación
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const ok = await refreshToken();
        if (!ok) logout(); // Si falla la renovación, cierra sesión
      } catch {
        logout();
      }
    }, due);
  };

  /**
   * Renueva el token JWT actual solicitando uno nuevo al backend.
   */
  const refreshToken = async () => {
    try {
      if (!token) return false;
      
      // Solicita un nuevo token al backend
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!res.ok || !data?.token) return false;

      // Actualiza el token en el mismo storage donde estaba guardado
      if (localStorage.getItem("token")) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user || user));
      }

      // Actualiza el estado con el nuevo token
      setToken(data.token);
      if (data.user) setUser(data.user);
      
      // Programa la siguiente renovación
      scheduleRefresh(data.token);
      
      return true;
    } catch (e) {
      console.error("refreshToken error:", e);
      return false;
    }
  };

  /* ==================
     PETICIONES HTTP AUTENTICADAS
     ================== */

  /**
   * Realiza una petición HTTP autenticada con el token actual.
   * 
   * Incluye lógica de retry automático: si la petición falla con 401 (no autorizado),
   * intenta renovar el token y reintenta la petición una vez.
   */
  const authFetch = async (url, options = {}) => {
    // Prepara los headers con el token de autenticación
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", headers.get("Content-Type") || "application/json");

    const doFetch = () => fetch(url, { ...options, headers });

    // Realiza la petición inicial
    let res = await doFetch();
    
    // Si responde con 401 (no autorizado), intenta renovar el token y reintentar
    if (res.status === 401) {
      const ok = await refreshToken();
      if (!ok) {
        logout(); // Si no se puede renovar, cierra sesión
        return res;
      }
      
      // Reintenta la petición con el nuevo token
      const headers2 = new Headers(options.headers || {});
      const newToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      headers2.set("Authorization", `Bearer ${newToken}`);
      headers2.set("Content-Type", headers2.get("Content-Type") || "application/json");
      res = await fetch(url, { ...options, headers: headers2 });
    }
    
    return res;
  };

  /**
   * Valor memoizado del contexto.
   * Se recalcula solo cuando cambian las dependencias especificadas.
   * Esto optimiza el rendimiento evitando re-renders innecesarios.
   */
  const value = useMemo(() => ({
    // Estado de autenticación
    isAuthenticated,  // boolean: indica si hay un usuario autenticado
    user,             // Object|null: datos del usuario autenticado
    token,            // string|null: token JWT actual
    loading,          // boolean: indica si se está cargando el estado inicial
    
    // Estado de internacionalización
    lang,             // string: idioma actual ('es' o 'en')
    setLang,          // function: establece el idioma
    
    // Estado de perfil activo
    activeStudent,    // Object|null: estudiante activo si un padre accede como hijo
    setActiveStudent, // function: establece el estudiante activo
    
    // Acciones de autenticación
    login,            // function: autentica un usuario
    logout,           // function: cierra la sesión actual
    checkAuthStatus,  // function: verifica y restaura sesión guardada
    refreshToken,     // function: renueva el token JWT
    authFetch,        // function: realiza peticiones HTTP autenticadas
  }), [isAuthenticated, user, token, loading, lang, activeStudent]);

  return (
    <AuthContext.Provider value={value}>
      {/* Solo renderiza los hijos cuando termine la carga inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
