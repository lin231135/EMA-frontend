// src/components/forms/LoginForm.jsx
// Componente de formulario de inicio de sesión 

import React, { useState, useEffect } from 'react';
import PasswordModal from './Popup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from "../layout/PageLayout";
import { RegisterImageCard } from "../forms/RegisterCards";
import { Link } from "react-router-dom";
import translations from '../../translations';

/**
 * Componente Login
 * Formulario de inicio de sesión con validación, manejo de errores y opciones de recordar sesión
 * @returns {JSX.Element} Página completa de login con layout y formulario
 */
const Login = () => {
  // Hooks de contexto y navegación
  const { lang, login } = useAuth();
  const t = translations[lang].login; // Traducciones según el idioma activo
  
  // Estado para los campos de email y contraseña
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Estado para el checkbox "Recordar sesión" (localStorage vs sessionStorage)
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estado para mostrar mensajes de error en el formulario
  const [error, setError] = useState('');

  // Estado para controlar la visibilidad del popup de restablecimiento de contraseña
  const [showResetPopup, setShowResetPopup] = useState(false);
  console.log('showResetPopup:', showResetPopup);
  
  // Estado para detectar si es el primer login del usuario (requiere cambio de contraseña)
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  /**
   * Maneja el cambio en los inputs de email y contraseña
   * Actualiza el estado de credentials dinámicamente según el campo modificado
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario de login
   * Valida los datos, realiza la petición al backend y maneja la respuesta
   * @param {Event} e - Evento de submit del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: campos obligatorios
    if (!credentials.email || !credentials.password) {
      setError(t.errorAllFields);
      return;
    }

    // Validación: formato de email
    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError(t.errorInvalidEmail);
      return;
    }

    try {
      // Petición al backend para autenticar al usuario
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      // Manejo de respuesta del servidor
      if (!response.ok) {
        throw new Error(data.message || t.errorLogin);
      }
      
      // Usar el contexto de autenticación para almacenar el token y usuario
      login(data.user, data.token, rememberMe);
      const { ok, error } = await login(credentials.email, credentials.password, rememberMe);
      if (!ok) throw new Error(error || t.errorLogin);

      // Verifica si es el primer acceso del usuario (requiere cambio de contraseña)
      const isFirst = data.user.is_first_login || false;

      if (isFirst) {
        // Si es primer login, mostrar popup para cambiar contraseña
        setIsFirstLogin(true);
        setShowResetPopup(true);
      } else {
        // Login exitoso, redirigir a selección de perfiles
        alert(t.welcomeMessage.replace('{name}', data.user.name));
        navigate('/parent/ParentProfileSelect');
      }

      setError(''); // Limpiar errores previos
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message);
    }
  };

  /**
   * Maneja la actualización de contraseña del usuario
   * Se ejecuta cuando el usuario completa el formulario del PasswordModal
   * @param {Object} data - Objeto con las contraseñas (current y new)
   */
  const handlePasswordUpdate = async (data) => {
    try {
      // Obtener información del usuario desde localStorage o sessionStorage
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

      // Petición al backend para actualizar la contraseña
      const response = await fetch('http://localhost:5000/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: data.current,
          newPassword: data.new
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      // Contraseña actualizada exitosamente
      alert(t.passwordUpdateSuccess);
      setTimeout(() => navigate('/'), 1000);

      // Cerrar el popup y resetear estado
      setShowResetPopup(false);
      setIsFirstLogin(false);
    } catch (err) {
      console.error(err.message);
      alert(t.passwordUpdateError.replace('{message}', err.message));
    }
  };

  return (
    <>
      {/* Layout principal de la página con navbar deshabilitado */}
      <PageLayout hideUserMenu={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-8">

            {/* Columna izquierda: Tarjeta de imagen decorativa (solo visible en pantallas grandes) */}
            <div className="flex-1 hidden lg:block">
              <div className="h-full max-h-[650px] overflow-hidden rounded-lg">
                <RegisterImageCard />
              </div>
            </div>

            {/* Columna derecha: Formulario de login */}
            <div className="flex-[1.2] flex items-center justify-center">
              <div className="flex-1 min-h-[400px] bg-white p-12 shadow-2xl flex flex-col justify-center rounded-lg">
                
                {/* Sección de encabezado: Logo y título */}
                <div className="text-center mb-6">
                  {/* Logo de Ellie's Music Academy */}
                  <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
                    <img
                      src="/LogoColorEMA4.svg"
                      alt={t.altLogo}
                      className="w-30 h-30 object-contain"
                    />
                  </div>
                  
                  {/* Título del formulario */}
                  <h2 className="text-center text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {t.title}
                  </h2>
                </div>

                {/* Banner de error (se muestra solo si hay un error) */}
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                {/* Formulario principal de inicio de sesión */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  
                  {/* Campo de entrada: Email */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      {t.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className="block w-full p-4 text-sm rounded-lg border transition-colors duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Campo de entrada: Contraseña */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      {t.passwordLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder={t.passwordPlaceholder}
                      className="block w-full p-4 text-sm rounded-lg border transition-colors duration-200 bg-gray-50 border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Fila de opciones: Recordar sesión y Olvidé mi contraseña */}
                  <div className="flex items-center justify-between">
                    {/* Checkbox: Recordar sesión */}
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-5 w-5 p-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        {t.rememberMe}
                      </label>
                    </div>

                    {/* Enlace: ¿Olvidaste tu contraseña? */}
                    <button
                      type="button"
                      onClick={() => setShowResetPopup(true)}
                      className="text-sm p-3 font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  {/* Botón de submit: Iniciar sesión */}
                  <div>
                    <button
                      type="submit"
                      className="w-full font-medium rounded-lg text-sm px-5 py-4 text-center transition-all duration-200 transform text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] cursor-pointer"
                    >
                      {t.loginButton}
                    </button>
                  </div>
                </form>

                {/* Pie del formulario: Enlace a registro */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    {t.noAccount}{' '}
                    <Link
                      to="/register"
                      className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      {t.register}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Modal de restablecimiento/cambio de contraseña */}
      {/* Se muestra cuando el usuario hace clic en "¿Olvidaste tu contraseña?" 
          o cuando es su primer login */}
      <PasswordModal
        isOpen={showResetPopup}
        onClose={() => {
          setShowResetPopup(false);
          setIsFirstLogin(false);
        }}
        onSubmit={handlePasswordUpdate}
      />
    </>
  );
};

export default Login;