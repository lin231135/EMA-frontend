import React, { useState, useEffect } from 'react';
import PasswordModal from './Popup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLayout from "../layout/PageLayout";
import { RegisterImageCard } from "../forms/RegisterCards";
import { Link } from "react-router-dom";
import translations from '../../translations';

const Login = () => {
  const { lang, login } = useAuth();
  const t = translations[lang].login;
  // Estado para los campos de email y contraseña
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Estado para el checkbox "Recordar sesión"
  const [rememberMe, setRememberMe] = useState(false);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('');

  const [showResetPopup, setShowResetPopup] = useState(false);
  console.log('showResetPopup:', showResetPopup);
  const [isFirstLogin, setIsFirstLogin] = useState(false); // Estado para simular primer acceso

  // Maneja el cambio en los inputs de email y contraseña
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError(t.errorAllFields);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      setError(t.errorInvalidEmail);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.errorLogin);
      }

      // Usar el contexto de autenticación para manejar el login
      login(data.user, data.token, rememberMe);

      // Verifica si es el primer acceso desde el backend (opcional)
      const isFirst = data.user.is_first_login || false;

      if (isFirst) {
        setIsFirstLogin(true);
        setShowResetPopup(true);
      } else {
        alert(t.welcomeMessage.replace('{name}', data.user.name));
        navigate('/'); // Redirige a la página de inicio
      }

      setError('');
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message);
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

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

      alert(t.passwordUpdateSuccess);
      setTimeout(() => navigate('/'), 1000);

      setShowResetPopup(false);
      setIsFirstLogin(false);
    } catch (err) {
      console.error(err.message);
      alert(t.passwordUpdateError.replace('{message}', err.message));
    }
  };

  // Formulario de login
  return (
    <>
      <PageLayout hideUserMenu={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-8">

            {/* Contenedor de RegisterImageCard - sin altura fija */}
            <div className="flex-1 hidden lg:block">
              <div className="h-full max-h-[650px] overflow-hidden rounded-lg">
                <RegisterImageCard />
              </div>
            </div>

            {/* Contenedor del formulario - se ajusta a la altura de RegisterImageCard */}
            <div className="flex-[1.2] flex items-center justify-center">
              <div className="flex-1 min-h-[400px] bg-white p-12 shadow-2xl flex flex-col justify-center rounded-lg">
                {/* Logo y titulo */}
                <div className="text-center mb-6">
                  {/* Ícono de usuario */}
                  <div className="inline-flex items-center justify-center w-30 h-30 mb-4">
                    <img
                      src="/LogoColorEMA4.svg"
                      alt={t.altLogo}
                      className="w-30 h-30 object-contain"
                    />
                  </div>
                  {/* Título */}
                  <h2 className="text-center text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {t.title}
                  </h2>
                </div>

                {/* Mensaje de error si existe */}
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                {/* Formulario de login */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Campo de email */}
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

                  {/* Contraseña */}
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

                  {/* Checkbox "Recordar sesión" y enlace para recuperar contraseña */}
                  <div className="flex items-center justify-between">
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

                    <button
                      type="button"
                      onClick={() => setShowResetPopup(true)}
                      className="text-sm p-3 font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  {/* Botón iniciar sesion */}
                  <div>
                    <button
                      type="submit"
                      className="w-full font-medium rounded-lg text-sm px-5 py-4 text-center transition-all duration-200 transform text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 hover:scale-[1.02] cursor-pointer"
                    >
                      {t.loginButton}
                    </button>
                  </div>
                </form>

                {/* Enlace para registrarse */}
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

      {/* Popup de restablecimiento de contraseña */}
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

// Exporta el componente Login
export default Login;